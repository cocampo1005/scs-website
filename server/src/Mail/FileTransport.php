<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

/** Local development: writes each message to a file instead of sending it. */
final class FileTransport implements MailTransport
{
    public function __construct(private readonly string $dir)
    {
    }

    public function send(ContactMessage $message): void
    {
        if (!is_dir($this->dir) && !@mkdir($this->dir, 0700, true)) {
            throw new MailFailure('outbox_unwritable');
        }
        $file = sprintf('%s/%s-%s.txt', $this->dir, gmdate('Ymd-His'), bin2hex(random_bytes(3)));
        $contents = "Subject: {$message->subject}\n"
            . "Reply-To: {$message->replyToName} <{$message->replyToAddress}>\n\n"
            . $message->textBody;
        if (@file_put_contents($file, $contents) === false) {
            throw new MailFailure('outbox_unwritable');
        }
    }
}
