<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

/**
 * Collects a safe summary of an SMTP session from PHPMailer's debug output
 * (SMTPDebug = DEBUG_SERVER): the last command verb, the AUTH mechanism, the
 * mechanisms the server offered, and the last reply's numeric and enhanced
 * status codes. Reply text, command arguments, AUTH exchanges and message data
 * are never kept, so the summary is safe to log.
 */
final class SmtpDiagnostics
{
    private const VERBS = ['EHLO', 'HELO', 'STARTTLS', 'AUTH', 'MAIL', 'RCPT', 'DATA', 'RSET'];
    private const MECHANISMS = ['LOGIN', 'PLAIN', 'CRAM-MD5', 'XOAUTH2'];

    private string $stage = 'CONNECT';
    private ?string $mechanism = null;
    /** @var list<string> */
    private array $offered = [];
    private ?string $reply = null;
    private ?string $status = null;
    private bool $inData = false;
    private bool $quitting = false;

    public function record(string $line): void
    {
        $line = trim($line);
        if (str_starts_with($line, 'CLIENT -> SERVER: ')) {
            $this->client(substr($line, 18));
        } elseif (str_starts_with($line, 'SERVER -> CLIENT: ') && !$this->quitting) {
            $this->server(substr($line, 18));
        }
    }

    private function client(string $command): void
    {
        // Message lines and AUTH payloads are not commands; only verbs count
        if ($this->inData) {
            return;
        }
        $parts = explode(' ', $command, 3);
        $verb = strtoupper($parts[0]);
        if ($verb === 'QUIT') {
            // Keep the reply that made PHPMailer give up, not the 221 Bye
            $this->quitting = $this->reply !== null;
            return;
        }
        if (!in_array($verb, self::VERBS, true)) {
            return;
        }
        $this->stage = $verb;
        $this->reply = $this->status = null;
        if ($verb === 'AUTH' && in_array(strtoupper($parts[1] ?? ''), self::MECHANISMS, true)) {
            $this->mechanism = strtoupper($parts[1]);
        }
    }

    private function server(string $reply): void
    {
        if (!preg_match('/^(\d{3})(?:[ -](\d\.\d{1,3}\.\d{1,3})\b)?/', $reply, $m)) {
            return;
        }
        $this->reply = $m[1];
        $this->status = $m[2] ?? null;
        $this->inData = $this->stage === 'DATA' && $m[1] === '354';
        if (in_array($this->stage, ['EHLO', 'HELO'], true)
            && preg_match('/^\d{3}[ -]AUTH[ =]([A-Z0-9 _-]+)\r?$/mi', $reply, $auth)) {
            $this->offered = array_values(array_intersect(
                array_map('strtoupper', preg_split('/\s+/', trim($auth[1])) ?: []),
                self::MECHANISMS,
            ));
        }
    }

    /** What the last reply means, as far as the codes tell */
    public function verdict(): string
    {
        $code = (int) $this->reply;
        return match (true) {
            $this->reply === null => $this->stage === 'CONNECT' ? 'no_greeting' : 'no_reply',
            $code < 400 => 'ok',
            $code >= 400 && $code < 500 => 'temporary_failure',
            $this->stage === 'AUTH' && in_array($code, [504, 534, 538], true) => 'mechanism_rejected',
            $this->stage === 'AUTH' && $code === 535 => 'credentials_rejected',
            $this->stage === 'AUTH' => 'auth_refused',
            $this->stage === 'MAIL' => 'sender_rejected',
            $this->stage === 'RCPT' => 'recipient_rejected',
            $this->stage === 'DATA' => 'message_rejected',
            default => 'rejected',
        };
    }

    /** e.g. stage:AUTH,mech:LOGIN,reply:535,status:5.7.8,verdict:credentials_rejected,offered:PLAIN.LOGIN */
    public function summary(): string
    {
        return implode(',', array_filter([
            'stage:' . $this->stage,
            $this->mechanism !== null ? 'mech:' . $this->mechanism : null,
            'reply:' . ($this->reply ?? 'none'),
            $this->status !== null ? 'status:' . $this->status : null,
            'verdict:' . $this->verdict(),
            $this->offered !== [] ? 'offered:' . implode('.', $this->offered) : null,
        ]));
    }
}
