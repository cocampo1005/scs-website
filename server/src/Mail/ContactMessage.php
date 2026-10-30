<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

use DateTimeImmutable;
use DateTimeZone;
use Scs\Contact\ContactSubmission;

/** The email sent to the company inbox for one validated submission. */
final class ContactMessage
{
    public function __construct(
        public readonly string $subject,
        public readonly string $textBody,
        public readonly string $replyToAddress,
        public readonly string $replyToName,
    ) {
    }

    public static function compose(
        ContactSubmission $s,
        string $sourceOrigin,
        int $now,
        string $timezone = 'UTC',
        string $subjectPrefix = '',
    ): self {
        $at = (new DateTimeImmutable('@' . $now))->setTimezone(new DateTimeZone($timezone));

        $phone = '—';
        if ($s->hasPhone()) {
            // Only characters a formatted number can contain
            $display = substr((string) preg_replace('/[^0-9+()\-. ]/', '', $s->phoneDisplay), 0, 32);
            $phone = ($display !== '' ? $display : '+' . $s->phoneDigits)
                . "\nWhatsApp: https://wa.me/" . $s->phoneDigits;
        }

        $body = implode("\n", [
            'Name: ' . $s->name,
            'Email: ' . $s->email,
            'Phone: ' . $phone,
            'Submitted: ' . $at->format('M j, Y g:i A T'),
            '',
            'Message:',
            $s->message,
            '',
            '—',
            'Sent from the contact form on ' . ($sourceOrigin !== '' ? $sourceOrigin : 'the website') . '.',
            'Reply to this email to answer the sender directly.',
        ]);

        return new self(
            subject: $subjectPrefix . 'Website inquiry from ' . $s->name,
            textBody: $body . "\n",
            replyToAddress: $s->email,
            replyToName: $s->name,
        );
    }
}
