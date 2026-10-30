<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PDO;
use PHPUnit\Framework\TestCase;
use Scs\Contact\Config;
use Scs\Contact\ContactHandler;
use Scs\Contact\ContactLog;
use Scs\Contact\RateLimiter;
use Scs\Contact\Request;
use Scs\Contact\Response;

final class ContactHandlerTest extends TestCase
{
    private const ORIGIN = 'https://solidcodesolutionsllc.com';
    private const T0 = 1_800_000_000;

    private FakeTransport $mail;
    private string $logPath;
    private ContactHandler $handler;

    protected function setUp(): void
    {
        $this->mail = new FakeTransport();
        $this->logPath = (string) tempnam(sys_get_temp_dir(), 'scs-log-');
        $config = Config::fromArray([
            'transport' => 'file',
            'allowed_origins' => [self::ORIGIN . '/', 'https://staging.solidcodesolutionsllc.com'],
            'ip_salt' => str_repeat('s', 64),
            'subject_prefix' => '[test] ',
            'timezone' => 'America/New_York',
            'blocked_terms' => ['casino'],
        ]);
        $db = new PDO('sqlite::memory:');
        $this->handler = new ContactHandler(
            $config,
            RateLimiter::attempts($db, 20, 600, 300),
            RateLimiter::sends($db, 5, 30),
            $this->mail,
            new ContactLog($this->logPath),
        );
    }

    protected function tearDown(): void
    {
        @unlink($this->logPath);
    }

    /** @param array<string, mixed> $overrides */
    private static function body(array $overrides = []): string
    {
        return (string) json_encode($overrides + [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => "Hello,\nwe need a booking site for our clinic.",
            'phone' => ['digits' => '447700900123', 'dialCode' => '44', 'display' => '+44 7700 900123'],
            'website' => '',
            'elapsedMs' => 45_000,
        ]);
    }

    private function post(string $body, array $request = []): Response
    {
        return $this->handler->handle(new Request(...$request + [
            'method' => 'POST',
            'contentType' => 'application/json',
            'body' => $body,
            'origin' => self::ORIGIN,
            'clientIp' => '203.0.113.7',
            'now' => self::T0,
        ]));
    }

    public function testSendsAValidMessage(): void
    {
        $res = $this->post(self::body());

        self::assertSame(200, $res->status);
        self::assertSame(['ok' => true], $res->body);
        self::assertCount(1, $this->mail->sent);

        $msg = $this->mail->sent[0];
        self::assertSame('[test] Website inquiry from Jane Doe', $msg->subject);
        self::assertSame('jane@example.com', $msg->replyToAddress);
        self::assertSame('Jane Doe', $msg->replyToName);
        self::assertStringContainsString("Phone: +44 7700 900123\nWhatsApp: https://wa.me/447700900123", $msg->textBody);
        self::assertStringContainsString("Message:\nHello,\nwe need a booking site", $msg->textBody);
        self::assertStringContainsString('Submitted: Jan 15, 2027', $msg->textBody);
        self::assertStringContainsString('contact form on https://solidcodesolutionsllc.com.', $msg->textBody);
    }

    public function testOmitsAnEmptyPhone(): void
    {
        $this->post(self::body(['phone' => ['digits' => '1', 'dialCode' => '1', 'display' => '+1']]));
        self::assertStringContainsString("Phone: —\n", $this->mail->sent[0]->textBody);
        self::assertStringNotContainsString('wa.me', $this->mail->sent[0]->textBody);
    }

    public function testRejectsOtherMethods(): void
    {
        $res = $this->post('', ['method' => 'GET']);
        self::assertSame(405, $res->status);
        self::assertSame('POST', $res->headers['Allow']);
    }

    public function testRequiresJson(): void
    {
        self::assertSame(415, $this->post(self::body(), ['contentType' => 'text/plain'])->status);
        self::assertSame(415, $this->post(self::body(), ['contentType' => 'application/x-www-form-urlencoded'])->status);
        self::assertSame(200, $this->post(self::body(), ['contentType' => 'application/json; charset=utf-8'])->status);
    }

    public function testRejectsOversizedBodies(): void
    {
        $res = $this->post(str_repeat(' ', Request::MAX_BODY_BYTES + 1));
        self::assertSame(413, $res->status);
        self::assertSame([], $this->mail->sent);
    }

    public function testRejectsUnknownOrigins(): void
    {
        self::assertSame(403, $this->post(self::body(), ['origin' => 'https://evil.example'])->status);
        self::assertSame(403, $this->post(self::body(), ['origin' => 'null'])->status);
        self::assertSame(403, $this->post(self::body(), ['origin' => ''])->status, 'no Origin and no Referer');
        self::assertSame(403, $this->post(self::body(), ['origin' => 'http://solidcodesolutionsllc.com'])->status);
        self::assertSame([], $this->mail->sent);
    }

    public function testFallsBackToTheReferer(): void
    {
        $res = $this->post(self::body(), ['origin' => '', 'referer' => 'https://staging.solidcodesolutionsllc.com/contact?x=1']);
        self::assertSame(200, $res->status);
    }

    public function testRejectsMalformedJson(): void
    {
        self::assertSame(400, $this->post('{"name":')->status);
        self::assertSame(400, $this->post('"just a string"')->status);
    }

    public function testHoneypotAndTimingTrapsAnswerOkWithoutSending(): void
    {
        self::assertSame(['ok' => true], $this->post(self::body(['website' => 'https://spam.example']))->body);
        self::assertSame(['ok' => true], $this->post(self::body(['elapsedMs' => 900]))->body);
        self::assertSame([], $this->mail->sent);
    }

    public function testMissingTimingIsNotTreatedAsABot(): void
    {
        $body = json_decode(self::body(), true);
        unset($body['elapsedMs']);
        self::assertSame(200, $this->post((string) json_encode($body))->status);
        self::assertCount(1, $this->mail->sent);
    }

    public function testReturnsFieldErrors(): void
    {
        $res = $this->post(self::body(['name' => "Jane\r\nBcc: x@example.com", 'email' => 'bad']));

        self::assertSame(422, $res->status);
        self::assertSame('validation', $res->body['error']);
        self::assertSame(['name', 'email'], array_keys($res->body['fields']));
        self::assertSame([], $this->mail->sent);
    }

    public function testScreenedMessagesGetAFieldError(): void
    {
        $res = $this->post(self::body(['message' => 'Best online CASINO offers for you']));
        self::assertSame(422, $res->status);
        self::assertArrayHasKey('message', $res->body['fields']);
        self::assertSame([], $this->mail->sent);
    }

    public function testRateLimitsTheSixthMessageInAnHour(): void
    {
        for ($i = 0; $i < 5; $i++) {
            self::assertSame(200, $this->post(self::body(), ['now' => self::T0 + $i])->status);
        }
        $res = $this->post(self::body(), ['now' => self::T0 + 600]);

        self::assertSame(429, $res->status);
        self::assertSame(['ok' => false, 'error' => 'rate_limited', 'retryAfter' => 3000], $res->body);
        self::assertSame('3000', $res->headers['Retry-After']);
        self::assertCount(5, $this->mail->sent);

        $other = $this->post(self::body(), ['now' => self::T0 + 600, 'clientIp' => '198.51.100.2']);
        self::assertSame(200, $other->status);
    }

    public function testInvalidSubmissionsDoNotUseUpTheSendLimit(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->post(self::body(['email' => 'bad']));
        }
        self::assertSame(200, $this->post(self::body())->status);
    }

    public function testRepeatedInvalidRequestsHitTheAttemptLimit(): void
    {
        for ($i = 0; $i < 20; $i++) {
            self::assertSame(422, $this->post(self::body(['email' => 'bad']), ['now' => self::T0 + $i])->status);
        }
        $res = $this->post(self::body(), ['now' => self::T0 + 30]);

        self::assertSame(429, $res->status, 'even a valid message waits once attempts are used up');
        self::assertSame(570, $res->body['retryAfter']);
        self::assertSame([], $this->mail->sent);
        self::assertStringContainsString('attempts_limited', (string) file_get_contents($this->logPath));

        self::assertSame(200, $this->post(self::body(), ['now' => self::T0 + 600])->status);
    }

    public function testEveryKindOfRejectedPostCountsAsAnAttempt(): void
    {
        $abuse = [
            [self::body(), ['origin' => 'https://evil.example']],
            ['{"name":', []],
            [self::body(), ['contentType' => 'text/plain']],
            [str_repeat(' ', Request::MAX_BODY_BYTES + 1), []],
            [self::body(['website' => 'spam']), []],
        ];
        for ($i = 0; $i < 20; $i++) {
            [$body, $request] = $abuse[$i % count($abuse)];
            $this->post($body, $request);
        }
        self::assertSame(429, $this->post(self::body())->status);
    }

    public function testNonPostRequestsAreNotStored(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->post('', ['method' => 'GET']);
        }
        self::assertSame(200, $this->post(self::body())->status);
    }

    public function testSmtpFailuresUseUpTheSendLimit(): void
    {
        $this->mail->failWith = 'smtp_connect';
        for ($i = 0; $i < 5; $i++) {
            self::assertSame(503, $this->post(self::body(), ['now' => self::T0 + $i])->status);
        }
        $this->mail->failWith = null;
        self::assertSame(429, $this->post(self::body(), ['now' => self::T0 + 10])->status);
        self::assertSame([], $this->mail->sent);
    }

    public function testReportsSendFailuresAsUnavailable(): void
    {
        $this->mail->failWith = 'smtp_auth';
        $res = $this->post(self::body());

        self::assertSame(503, $res->status);
        self::assertSame(['ok' => false, 'error' => 'unavailable'], $res->body);
        self::assertStringContainsString('send_failed client=', (string) file_get_contents($this->logPath));
        self::assertStringContainsString('smtp_auth', (string) file_get_contents($this->logPath));
    }

    public function testLogsOutcomesWithoutPersonalData(): void
    {
        $this->post(self::body());
        $this->post(self::body(['email' => 'bad']));
        $this->post(self::body(), ['origin' => 'https://evil.example']);

        $log = (string) file_get_contents($this->logPath);
        self::assertMatchesRegularExpression('/^2027-01-15T\S+Z sent client=[0-9a-f]{12}$/m', $log);
        self::assertStringContainsString('invalid client=', $log);
        self::assertStringContainsString('forbidden_origin client=', $log);
        foreach (['Jane', 'jane@example.com', 'booking', '203.0.113.7', '7700'] as $private) {
            self::assertStringNotContainsString($private, $log);
        }
    }

    public function testErrorResponsesNeverContainExceptionDetails(): void
    {
        $this->mail->failWith = 'smtp_connect';
        $json = (string) json_encode($this->post(self::body())->body);
        self::assertSame('{"ok":false,"error":"unavailable"}', $json);
    }
}
