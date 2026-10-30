<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

/** Authenticated SMTP through the company mailbox (Hostinger Email). */
final class SmtpTransport implements MailTransport
{
    /**
     * @param array{host: string, port: int, encryption: string, username: string, password: string, timeout?: int} $smtp
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
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $this->smtp['host'];
            $mail->Port = $this->smtp['port'];
            $mail->SMTPSecure = $this->smtp['encryption'] === 'starttls'
                ? PHPMailer::ENCRYPTION_STARTTLS
                : PHPMailer::ENCRYPTION_SMTPS;
            $mail->SMTPAuth = true;
            $mail->Username = $this->smtp['username'];
            $mail->Password = $this->smtp['password'];
            $mail->Timeout = $this->smtp['timeout'] ?? 10;
            $mail->CharSet = PHPMailer::CHARSET_UTF8;
            $mail->XMailer = null;

            $mail->setFrom($this->from['address'], $this->from['name'] ?? '', false);
            $mail->addAddress($this->to['address'], $this->to['name'] ?? '');
            $mail->addReplyTo($message->replyToAddress, $message->replyToName);
            $mail->isHTML(false);
            $mail->Subject = $message->subject;
            $mail->Body = $message->textBody;

            $mail->send();
        } catch (PHPMailerException $e) {
            throw new MailFailure(self::reason($mail->ErrorInfo), 0, $e);
        } finally {
            $mail->smtpClose();
        }
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
