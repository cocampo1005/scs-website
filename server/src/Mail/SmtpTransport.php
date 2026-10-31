<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/** Authenticated SMTP through the company mailbox (Hostinger Email). */
final class SmtpTransport implements MailTransport
{
    /**
     * smtp.hostinger.com advertises "AUTH PLAIN LOGIN". Pinned so the
     * mechanism never depends on PHPMailer's automatic choice.
     */
    public const AUTH_TYPE = 'LOGIN';

    /**
     * @param array{host: string, port: int, encryption: string, username: string, password: string, timeout?: int} $smtp
     *        encryption: 'smtps', 'starttls', or 'none' (tests against a local fake server only; Config rejects it)
     * @param array{address: string, name?: string} $from
     * @param array{address: string, name?: string} $to
     */
    public function __construct(
        private readonly array $smtp,
        private readonly array $from,
        private readonly array $to,
    ) {
    }

    public function send(ContactMessage $message): void
    {
        $diagnostics = new SmtpDiagnostics();
        $mail = $this->mailer($diagnostics);
        try {
            $mail->setFrom($this->from['address'], $this->from['name'] ?? '', false);
            $mail->addAddress($this->to['address'], $this->to['name'] ?? '');
            $mail->addReplyTo($message->replyToAddress, $message->replyToName);
            $mail->isHTML(false);
            $mail->Subject = $message->subject;
            $mail->Body = $message->textBody;

            $mail->send();
        } catch (PHPMailerException $e) {
            throw $this->failure($mail, $diagnostics, $e);
        } finally {
            $mail->smtpClose();
        }
    }

    /**
     * Connects, starts TLS and authenticates, then quits: no message is sent.
     * Returns the safe session summary; throws MailFailure like send().
     */
    public function verify(): string
    {
        $diagnostics = new SmtpDiagnostics();
        $mail = $this->mailer($diagnostics);
        try {
            $mail->smtpConnect();
            return 'ok,' . $diagnostics->summary() . ',' . $this->configSummary();
        } catch (PHPMailerException $e) {
            throw $this->failure($mail, $diagnostics, $e);
        } finally {
            $mail->smtpClose();
        }
    }

    private function mailer(SmtpDiagnostics $diagnostics): PHPMailer
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $this->smtp['host'];
        $mail->Port = $this->smtp['port'];
        $mail->SMTPSecure = match ($this->smtp['encryption']) {
            'starttls' => PHPMailer::ENCRYPTION_STARTTLS,
            'none' => '',
            default => PHPMailer::ENCRYPTION_SMTPS,
        };
        $mail->SMTPAutoTLS = $this->smtp['encryption'] !== 'none';
        $mail->SMTPAuth = true;
        $mail->AuthType = self::AUTH_TYPE;
        $mail->Username = $this->smtp['username'];
        $mail->Password = $this->smtp['password'];
        $mail->Timeout = $this->smtp['timeout'] ?? 10;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->XMailer = null;

        // Server replies and command verbs only; PHPMailer hides credentials at
        // this level, and SmtpDiagnostics keeps codes, never text
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->Debugoutput = static function ($line) use ($diagnostics): void {
            $diagnostics->record((string) $line);
        };

        return $mail;
    }

    private function failure(PHPMailer $mail, SmtpDiagnostics $diagnostics, PHPMailerException $e): MailFailure
    {
        return new MailFailure(
            self::reason($mail->ErrorInfo ?: $e->getMessage()) . ',' . $diagnostics->summary() . ',' . $this->configSummary(),
            0,
            $e,
        );
    }

    /**
     * Which settings were loaded, without secrets: endpoint, the username's
     * domain, and whether the password is set or has surrounding whitespace.
     */
    private function configSummary(): string
    {
        $password = (string) $this->smtp['password'];
        $username = (string) $this->smtp['username'];
        return sprintf(
            'cfg:%s:%d:%s,user:%s,pw:%s',
            $this->smtp['host'],
            $this->smtp['port'],
            $this->smtp['encryption'],
            str_contains($username, '@') ? substr($username, strrpos($username, '@') + 1) : 'no_domain',
            $password === '' ? 'empty' : ($password !== trim($password) ? 'whitespace' : 'set'),
        );
    }

    /** Maps PHPMailer's error text (which can contain addresses) to a code. */
    private static function reason(string $error): string
    {
        return match (true) {
            str_contains($error, 'Could not authenticate') => 'smtp_auth',
            str_contains($error, 'connect') => 'smtp_connect',
            str_contains($error, 'recipients failed') => 'smtp_recipient',
            str_contains($error, 'data not accepted') => 'smtp_data',
            default => 'smtp_error',
        };
    }
}
