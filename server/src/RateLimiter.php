<?php

declare(strict_types=1);

namespace Scs\Contact;

use PDO;
use Throwable;

/**
 * Sliding-window limits in SQLite. Each limiter owns a bucket of events and a
 * set of rules, either per client (hashed IP) or site-wide. The handler uses
 * two buckets on one database:
 *
 * - "attempts": every POST, whatever its outcome (invalid, trapped, rejected
 *   origin, SMTP failure), so repeated bad requests are cut off early;
 * - "sends": only messages that reach the mail transport, so the mailbox
 *   quota is protected even when attempts stay under their limit.
 *
 * Over-limit requests are not recorded, so a client's rows stay bounded by its
 * limit and the window ends on schedule. Old rows are pruned on every call.
 */
final class RateLimiter
{
    public const HOUR = 3600;
    public const DAY = 86400;

    private readonly int $maxWindow;

    /**
     * @param list<array{scope: 'client'|'site', limit: int, window: int}> $rules
     */
    public function __construct(
        private readonly PDO $db,
        private readonly string $bucket,
        private readonly array $rules,
    ) {
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(PDO::ATTR_TIMEOUT, 5);
        $this->db->exec('CREATE TABLE IF NOT EXISTS events (bucket TEXT NOT NULL, client TEXT NOT NULL, at INTEGER NOT NULL)');
        $this->db->exec('CREATE INDEX IF NOT EXISTS events_bucket_client_at ON events (bucket, client, at)');
        $this->maxWindow = max(array_column($rules, 'window') ?: [self::DAY]);
    }

    public static function database(string $path): PDO
    {
        return new PDO('sqlite:' . $path);
    }

    /** Messages handed to the mail transport. */
    public static function sends(PDO $db, int $perClientPerHour, int $sitePerDay): self
    {
        return new self($db, 'sends', [
            ['scope' => 'client', 'limit' => $perClientPerHour, 'window' => self::HOUR],
            ['scope' => 'site', 'limit' => $sitePerDay, 'window' => self::DAY],
        ]);
    }

    /** Every POST to the endpoint, counted before any other work. */
    public static function attempts(PDO $db, int $perClient, int $clientWindow, int $sitePerHour): self
    {
        return new self($db, 'attempts', [
            ['scope' => 'client', 'limit' => $perClient, 'window' => $clientWindow],
            ['scope' => 'site', 'limit' => $sitePerHour, 'window' => self::HOUR],
        ]);
    }

    /**
     * Records one event for $client if every rule allows it.
     *
     * @return int 0 when allowed, otherwise seconds until it would be
     */
    public function consume(string $client, int $now): int
    {
        // IMMEDIATE takes the write lock up front, so check-and-insert is atomic
        $this->db->exec('BEGIN IMMEDIATE');
        try {
            $this->db->prepare('DELETE FROM events WHERE bucket = ? AND at <= ?')
                ->execute([$this->bucket, $now - $this->maxWindow]);

            $wait = 0;
            foreach ($this->rules as $rule) {
                $wait = max($wait, $rule['scope'] === 'client'
                    ? $this->waitFor('client = ? AND at > ?', [$client, $now - $rule['window']], $rule, $now)
                    : $this->waitFor('at > ?', [$now - $rule['window']], $rule, $now));
            }
            if ($wait === 0) {
                $this->db->prepare('INSERT INTO events (bucket, client, at) VALUES (?, ?, ?)')
                    ->execute([$this->bucket, $client, $now]);
            }

            $this->db->exec('COMMIT');
            return $wait;
        } catch (Throwable $e) {
            $this->db->exec('ROLLBACK');
            throw $e;
        }
    }

    /**
     * @param list<string|int> $params
     * @param array{limit: int, window: int} $rule
     */
    private function waitFor(string $where, array $params, array $rule, int $now): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*), MIN(at) FROM events WHERE bucket = ? AND {$where}");
        $stmt->execute([$this->bucket, ...$params]);
        [$count, $oldest] = $stmt->fetch(PDO::FETCH_NUM);

        // A slot frees up when the oldest event in the window ages out
        return (int) $count >= $rule['limit'] ? max(1, (int) $oldest + $rule['window'] - $now) : 0;
    }
}
