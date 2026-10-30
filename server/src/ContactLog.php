<?php

declare(strict_types=1);

namespace Scs\Contact;

/**
 * One line per request: time, outcome, hashed client and a short reason code.
 * Never names, addresses, message text or credentials.
 */
final class ContactLog
{
    public function __construct(
        private readonly string $path,
        private readonly int $maxBytes = 1_000_000,
    ) {
    }

    public function record(string $outcome, string $client = '-', string $detail = '', ?int $now = null): void
    {
        $line = sprintf(
            "%s %s client=%s%s\n",
            gmdate('Y-m-d\TH:i:s\Z', $now ?? time()),
            $outcome,
            substr($client, 0, 12) ?: '-',
            $detail === '' ? '' : ' ' . preg_replace('/[^\w.,:-]/', '_', $detail),
        );

        // Logging must never break a request, so failures are ignored
        if (@filesize($this->path) > $this->maxBytes) {
            @rename($this->path, $this->path . '.1');
        }
        @file_put_contents($this->path, $line, FILE_APPEND | LOCK_EX);
    }
}
