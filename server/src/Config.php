<?php

declare(strict_types=1);

namespace Scs\Contact;

use RuntimeException;

/** Settings from the server-only config.php (see config.example.php). */
final class Config
{
    /**
     * @param list<string> $allowedOrigins
     * @param array<string, mixed> $smtp
     * @param array{address: string, name?: string} $from
     * @param array{address: string, name?: string} $to
     * @param list<string> $blockedTerms
     */
    public function __construct(
        public readonly string $transport,
        public readonly array $allowedOrigins,
        public readonly string $ipSalt,
        public readonly array $smtp = [],
        public readonly array $from = ['address' => ''],
        public readonly array $to = ['address' => ''],
        public readonly ?string $clientIpHeader = null,
        public readonly string $subjectPrefix = '',
        public readonly string $timezone = 'UTC',
        public readonly int $perClientPerHour = 5,
        public readonly int $sitePerDay = 30,
        public readonly int $attemptsPerClient = 20,
        public readonly int $attemptsWindow = 600,
        public readonly int $attemptsSitePerHour = 300,
        public readonly int $minFillMs = 3000,
        public readonly int $maxLinks = 3,
        public readonly array $blockedTerms = [],
    ) {
    }

    public static function load(string $path): self
    {
        if (!is_file($path)) {
            throw new RuntimeException('config_missing');
        }
        $values = require $path;
        if (!is_array($values)) {
            throw new RuntimeException('config_invalid');
        }
        return self::fromArray($values);
    }

    /** @param array<string, mixed> $v */
    public static function fromArray(array $v): self
    {
        $limits = $v['limits'] ?? [];
        $config = new self(
            transport: (string) ($v['transport'] ?? 'smtp'),
            allowedOrigins: array_values(array_map(
                static fn ($o) => rtrim((string) $o, '/'),
                (array) ($v['allowed_origins'] ?? []),
            )),
            ipSalt: (string) ($v['ip_salt'] ?? ''),
            smtp: (array) ($v['smtp'] ?? []),
            from: (array) ($v['from'] ?? ['address' => '']),
            to: (array) ($v['to'] ?? ['address' => '']),
            clientIpHeader: isset($v['client_ip_header']) ? (string) $v['client_ip_header'] : null,
            subjectPrefix: (string) ($v['subject_prefix'] ?? ''),
            timezone: (string) ($v['timezone'] ?? 'UTC'),
            perClientPerHour: (int) ($limits['per_client_per_hour'] ?? 5),
            sitePerDay: (int) ($limits['site_per_day'] ?? 30),
            attemptsPerClient: (int) ($limits['attempts_per_client'] ?? 20),
            attemptsWindow: (int) ($limits['attempts_window'] ?? 600),
            attemptsSitePerHour: (int) ($limits['attempts_site_per_hour'] ?? 300),
            minFillMs: (int) ($limits['min_fill_ms'] ?? 3000),
            maxLinks: (int) ($limits['max_links'] ?? 3),
            blockedTerms: array_values(array_map('strval', (array) ($v['blocked_terms'] ?? []))),
        );
        $config->check();
        return $config;
    }

    private function check(): void
    {
        $problems = [];
        if (!in_array($this->transport, ['smtp', 'file'], true)) {
            $problems[] = 'transport';
        }
        if ($this->allowedOrigins === []) {
            $problems[] = 'allowed_origins';
        }
        if (strlen($this->ipSalt) < 32) {
            $problems[] = 'ip_salt';
        }
        foreach (['perClientPerHour', 'sitePerDay', 'attemptsPerClient', 'attemptsWindow', 'attemptsSitePerHour'] as $limit) {
            if ($this->{$limit} < 1) {
                $problems[] = "limits.{$limit}";
            }
        }
        if (!in_array($this->timezone, timezone_identifiers_list(), true)) {
            $problems[] = 'timezone';
        }
        if ($this->transport === 'smtp') {
            foreach (['host', 'port', 'encryption', 'username', 'password'] as $key) {
                if (empty($this->smtp[$key])) {
                    $problems[] = "smtp.{$key}";
                }
            }
            if (!in_array($this->smtp['encryption'] ?? '', ['smtps', 'starttls'], true)) {
                $problems[] = 'smtp.encryption';
            }
            foreach (['from' => $this->from, 'to' => $this->to] as $key => $mailbox) {
                if (!ContactValidator::isEmail((string) ($mailbox['address'] ?? ''))) {
                    $problems[] = "{$key}.address";
                }
            }
        }
        if ($problems !== []) {
            // Key names only, never values
            throw new RuntimeException('config_invalid:' . implode(',', array_unique($problems)));
        }
    }
}
