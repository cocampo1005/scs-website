<?php

declare(strict_types=1);

namespace Scs\Contact;

use Scs\Contact\Mail\ContactMessage;
use Scs\Contact\Mail\FileTransport;
use Scs\Contact\Mail\MailFailure;
use Scs\Contact\Mail\MailTransport;
use Scs\Contact\Mail\SmtpTransport;

/**
 * POST /api/contact. Checks run in this order; the first failure answers:
 * method → attempt limit → content type → size → origin → JSON →
 * honeypot/timing → validation → spam heuristics → send limit → send.
 * The attempt limit counts every POST, so invalid or abusive requests are
 * capped too; the send limit protects the mailbox.
 * Response shapes are documented in docs/contact-smtp-plan.md.
 */
final class ContactHandler
{
    public function __construct(
        private readonly Config $config,
        private readonly RateLimiter $attempts,
        private readonly RateLimiter $sends,
        private readonly MailTransport $transport,
        private readonly ContactLog $log,
    ) {
    }

    /** Wires the real collaborators; $varDir holds the rate-limit store, log and dev outbox. */
    public static function create(Config $config, string $varDir, ContactLog $log): self
    {
        if (!is_dir($varDir)) {
            @mkdir($varDir, 0700, true);
        }
        $transport = $config->transport === 'file'
            ? new FileTransport($varDir . '/outbox')
            : new SmtpTransport($config->smtp, $config->from, $config->to);

        $db = RateLimiter::database($varDir . '/ratelimit.sqlite');

        return new self(
            $config,
            RateLimiter::attempts($db, $config->attemptsPerClient, $config->attemptsWindow, $config->attemptsSitePerHour),
            RateLimiter::sends($db, $config->perClientPerHour, $config->sitePerDay),
            $transport,
            $log,
        );
    }

    public function handle(Request $request): Response
    {
        $now = $request->now ?? time();
        $client = $request->clientIp === ''
            ? '-'
            : hash_hmac('sha256', $request->clientIp, $this->config->ipSalt);
        $log = fn (string $outcome, string $detail = '') => $this->log->record($outcome, $client, $detail, $now);

        if ($request->method !== 'POST') {
            return Response::error(405, 'method_not_allowed', [], ['Allow' => 'POST']);
        }

        $wait = $this->attempts->consume($client, $now);
        if ($wait > 0) {
            $log('attempts_limited');
            return self::rateLimited($wait);
        }
        if (!$request->isJson()) {
            return Response::error(415, 'unsupported_media_type');
        }
        if (strlen($request->body) > Request::MAX_BODY_BYTES) {
            $log('too_large');
            return Response::error(413, 'payload_too_large');
        }

        $origin = $request->sourceOrigin();
        if (!in_array($origin, $this->config->allowedOrigins, true)) {
            $log('forbidden_origin');
            return Response::error(403, 'forbidden');
        }

        $data = json_decode($request->body, true, 8);
        if (!is_array($data)) {
            $log('bad_json');
            return Response::error(400, 'bad_request');
        }

        // Bots get the same answer as a real send and learn nothing
        $elapsed = $data['elapsedMs'] ?? null;
        if (!empty($data['website']) || (is_int($elapsed) && $elapsed < $this->config->minFillMs)) {
            $log('trap', !empty($data['website']) ? 'honeypot' : 'too_fast');
            return Response::ok();
        }

        $submission = ContactSubmission::fromInput($data);
        $validator = new ContactValidator($this->config->maxLinks, $this->config->blockedTerms);

        $fields = $validator->validate($submission);
        if ($fields !== []) {
            $log('invalid', implode(',', array_keys($fields)));
            return Response::error(422, 'validation', ['fields' => $fields]);
        }

        $flag = $validator->screen($submission);
        if ($flag !== []) {
            $log('screened', $flag['reason']);
            return Response::error(422, 'validation', ['fields' => ['message' => $flag['message']]]);
        }

        $wait = $this->sends->consume($client, $now);
        if ($wait > 0) {
            $log('rate_limited');
            return self::rateLimited($wait);
        }

        try {
            $this->transport->send(ContactMessage::compose(
                $submission,
                $origin,
                $now,
                $this->config->timezone,
                $this->config->subjectPrefix,
            ));
        } catch (MailFailure $e) {
            $log('send_failed', $e->getMessage());
            return Response::error(503, 'unavailable');
        }

        $log('sent');
        return Response::ok();
    }

    private static function rateLimited(int $wait): Response
    {
        return Response::error(429, 'rate_limited', ['retryAfter' => $wait], ['Retry-After' => (string) $wait]);
    }
}
