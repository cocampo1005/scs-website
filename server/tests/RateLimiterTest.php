<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PDO;
use PHPUnit\Framework\TestCase;
use Scs\Contact\RateLimiter;

final class RateLimiterTest extends TestCase
{
    private const T0 = 1_800_000_000;

    private PDO $db;

    protected function setUp(): void
    {
        $this->db = new PDO('sqlite::memory:');
    }

    public function testAllowsFivePerClientPerHourThenReportsTheWait(): void
    {
        $limiter = RateLimiter::sends($this->db, 5, 30);
        for ($i = 0; $i < 5; $i++) {
            self::assertSame(0, $limiter->consume('a', self::T0 + $i * 60));
        }

        // The first send (T0) ages out of the hour at T0 + 3600
        self::assertSame(3600 - 300, $limiter->consume('a', self::T0 + 300));
        self::assertSame(0, $limiter->consume('b', self::T0 + 300), 'other clients are unaffected');
        self::assertSame(0, $limiter->consume('a', self::T0 + 3600));
    }

    public function testRejectedAttemptsDoNotExtendTheWindow(): void
    {
        $limiter = RateLimiter::sends($this->db, 1, 30);
        self::assertSame(0, $limiter->consume('a', self::T0));
        self::assertGreaterThan(0, $limiter->consume('a', self::T0 + 10));
        self::assertGreaterThan(0, $limiter->consume('a', self::T0 + 20));
        self::assertSame(0, $limiter->consume('a', self::T0 + 3600));
    }

    public function testCapsTheWholeSitePerDay(): void
    {
        $limiter = RateLimiter::sends($this->db, 5, 3);
        self::assertSame(0, $limiter->consume('a', self::T0));
        self::assertSame(0, $limiter->consume('b', self::T0 + 10));
        self::assertSame(0, $limiter->consume('c', self::T0 + 20));

        self::assertSame(86400 - 100, $limiter->consume('d', self::T0 + 100));
        self::assertSame(0, $limiter->consume('d', self::T0 + 86400));
    }

    public function testPrunesRowsOlderThanADay(): void
    {
        $limiter = RateLimiter::sends($this->db, 5, 30);
        $limiter->consume('a', self::T0);
        $limiter->consume('b', self::T0 + 1000);
        $limiter->consume('c', self::T0 + 86400 + 500);

        self::assertSame(2, (int) $this->db->query("SELECT COUNT(*) FROM events WHERE bucket = 'sends'")->fetchColumn());
    }

    public function testPersistsAcrossConnections(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'scs-rl-');
        try {
            RateLimiter::sends(RateLimiter::database($path), 1, 30)->consume('a', self::T0);
            self::assertGreaterThan(0, RateLimiter::sends(RateLimiter::database($path), 1, 30)->consume('a', self::T0 + 1));
        } finally {
            @unlink($path);
        }
    }

    public function testAttemptsAndSendsAreIndependentBuckets(): void
    {
        $attempts = RateLimiter::attempts($this->db, 2, 600, 300);
        $sends = RateLimiter::sends($this->db, 5, 30);

        self::assertSame(0, $attempts->consume('a', self::T0));
        self::assertSame(0, $attempts->consume('a', self::T0 + 1));
        self::assertSame(599, $attempts->consume('a', self::T0 + 1));
        self::assertSame(0, $sends->consume('a', self::T0 + 1), 'attempts do not use up sends');
        self::assertSame(0, $attempts->consume('a', self::T0 + 600));
    }

    public function testCapsAttemptsSiteWidePerHour(): void
    {
        $attempts = RateLimiter::attempts($this->db, 20, 600, 3);
        foreach (['a', 'b', 'c'] as $i => $client) {
            self::assertSame(0, $attempts->consume($client, self::T0 + $i));
        }
        self::assertSame(3600 - 10, $attempts->consume('d', self::T0 + 10));
    }

    public function testOverLimitRequestsAreNotStored(): void
    {
        $attempts = RateLimiter::attempts($this->db, 2, 600, 300);
        for ($i = 0; $i < 50; $i++) {
            $attempts->consume('flood', self::T0 + $i);
        }
        $rows = (int) $this->db->query("SELECT COUNT(*) FROM events WHERE bucket = 'attempts'")->fetchColumn();
        self::assertSame(2, $rows, 'storage stays bounded by the limit under a flood');
    }
}
