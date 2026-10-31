<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PHPUnit\Framework\TestCase;
use Scs\Contact\Mail\ContactMessage;
use Scs\Contact\Mail\MailFailure;
use Scs\Contact\Mail\SmtpDiagnostics;
use Scs\Contact\Mail\SmtpTransport;

/** Runs the real PHPMailer session against tests/fixtures/fake-smtp.php. */
final class SmtpTransportTest extends TestCase
{
    private const PASSWORD = 'correct-horse';

    /** @var resource|null */
    private $process = null;
    /** @var array<int, resource> */
    private array $pipes = [];

    protected function tearDown(): void
    {
        if (is_resource($this->process)) {
            proc_terminate($this->process);
            proc_close($this->process);
        }
    }

    private function transport(string $password): SmtpTransport
    {
        $this->process = proc_open(
            [PHP_BINARY, __DIR__ . '/fixtures/fake-smtp.php', self::PASSWORD],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $this->pipes,
        );
        $port = (int) fgets($this->pipes[1]);
        self::assertGreaterThan(0, $port, 'fake SMTP server started');

        return new SmtpTransport(
            ['host' => '127.0.0.1', 'port' => $port, 'encryption' => 'none', 'username' => 'christian@example.com', 'password' => $password, 'timeout' => 5],
            ['address' => 'christian@example.com', 'name' => 'Website'],
            ['address' => 'christian@example.com'],
        );
    }

    /** What the server saw: verbs, the AUTH line and the auth result */
    private function serverLog(): string
    {
        $log = (string) stream_get_contents($this->pipes[1]);
        fclose($this->pipes[1]);
        fclose($this->pipes[2]);
        proc_close($this->process);
        $this->process = null;
        return $log;
    }

    private static function message(): ContactMessage
    {
        return new ContactMessage('Website inquiry from Jane', "Hello", 'jane@example.com', 'Jane');
    }

    public function testAuthenticatesWithLoginAndSends(): void
    {
        $this->transport(self::PASSWORD)->send(self::message());
        $log = $this->serverLog();

        self::assertStringContainsString("AUTH LOGIN\nAUTH-RESULT ok\nMAIL\nRCPT\nDATA\n", $log);
        self::assertStringNotContainsString('AUTH PLAIN', $log);
    }

    public function testRejectedCredentialsAreReportedWithCodesAndNoSecrets(): void
    {
        try {
            $this->transport('wrong-password')->send(self::message());
            self::fail('expected a MailFailure');
        } catch (MailFailure $e) {
            preg_match('/cfg:127\.0\.0\.1:(\d+):/', $e->getMessage(), $m);
            $port = $m[1] ?? '';
            self::assertSame(
                "smtp_auth,stage:AUTH,mech:LOGIN,reply:535,status:5.7.8,verdict:credentials_rejected,offered:PLAIN.LOGIN,cfg:127.0.0.1:{$port}:none,user:example.com,pw:set",
                $e->getMessage(),
            );
            foreach (['wrong-password', base64_encode('wrong-password'), 'UGFzc3dvcmQ6', 'VXNlcm5hbWU6', 'christian', 'jane'] as $secret) {
                self::assertStringNotContainsString($secret, $e->getMessage());
            }
        }
        self::assertStringContainsString("AUTH LOGIN\nAUTH-RESULT fail\n", $this->serverLog());
    }

    public function testVerifyAuthenticatesWithoutSendingAMessage(): void
    {
        $summary = $this->transport(self::PASSWORD)->verify();
        $log = $this->serverLog();

        self::assertStringStartsWith('ok,stage:AUTH,mech:LOGIN,reply:235,status:2.7.0,verdict:ok,offered:PLAIN.LOGIN,cfg:', $summary);
        self::assertStringContainsString('AUTH-RESULT ok', $log);
        self::assertStringNotContainsString('MAIL', $log);
        self::assertStringNotContainsString('DATA', $log);
    }

    public function testReportsAPasswordWithSurroundingWhitespace(): void
    {
        try {
            $this->transport(self::PASSWORD . ' ')->verify();
            self::fail('expected a MailFailure');
        } catch (MailFailure $e) {
            self::assertStringEndsWith(',pw:whitespace', $e->getMessage());
        }
    }

    public function testUnreachableServer(): void
    {
        $transport = new SmtpTransport(
            ['host' => '127.0.0.1', 'port' => 9, 'encryption' => 'none', 'username' => 'a@example.com', 'password' => 'x', 'timeout' => 2],
            ['address' => 'a@example.com'],
            ['address' => 'a@example.com'],
        );
        try {
            $transport->verify();
            self::fail('expected a MailFailure');
        } catch (MailFailure $e) {
            self::assertStringStartsWith('smtp_connect,stage:CONNECT,reply:none,verdict:no_greeting,', $e->getMessage());
        }
    }

    public function testDiagnosticsIgnoreMessageDataAndQuit(): void
    {
        $d = new SmtpDiagnostics();
        foreach ([
            "CLIENT -> SERVER: EHLO host\r\n",
            "SERVER -> CLIENT: 250-fake.test\r\n250 AUTH PLAIN LOGIN\r\n",
            "CLIENT -> SERVER: MAIL FROM:<christian@example.com>\r\n",
            "SERVER -> CLIENT: 250 2.1.0 Ok\r\n",
            "CLIENT -> SERVER: DATA\r\n",
            "SERVER -> CLIENT: 354 go ahead\r\n",
            "CLIENT -> SERVER: RCPT this is a body line\r\n",
            "CLIENT -> SERVER: .\r\n",
            "SERVER -> CLIENT: 554 5.7.1 rejected for policy reasons jane@example.com\r\n",
            "CLIENT -> SERVER: QUIT\r\n",
            "SERVER -> CLIENT: 221 2.0.0 Bye\r\n",
        ] as $line) {
            $d->record($line);
        }

        self::assertSame('stage:DATA,reply:554,status:5.7.1,verdict:message_rejected,offered:PLAIN.LOGIN', $d->summary());
    }

    public function testClassifiesAuthReplies(): void
    {
        foreach (['504 5.5.4' => 'mechanism_rejected', '534 5.7.9' => 'mechanism_rejected', '535 5.7.8' => 'credentials_rejected', '454 4.7.0' => 'temporary_failure', '550 5.7.1' => 'auth_refused'] as $reply => $verdict) {
            $d = new SmtpDiagnostics();
            $d->record('CLIENT -> SERVER: AUTH LOGIN');
            $d->record("SERVER -> CLIENT: {$reply} text");
            self::assertSame($verdict, $d->verdict(), $reply);
        }
    }
}
