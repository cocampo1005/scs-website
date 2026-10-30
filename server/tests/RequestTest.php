<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PHPUnit\Framework\TestCase;
use Scs\Contact\IpRange;
use Scs\Contact\Request;

final class RequestTest extends TestCase
{
    private const PROXIES = ['10.0.0.0/8', '2001:db8::/32'];

    public function testUsesRemoteAddrWithoutAHeader(): void
    {
        self::assertSame('203.0.113.7', Request::clientIp(['REMOTE_ADDR' => '203.0.113.7'], null, []));
    }

    public function testTrustsTheHeaderOnlyFromAProxy(): void
    {
        $server = ['REMOTE_ADDR' => '10.1.2.3', 'HTTP_X_FORWARDED_FOR' => '198.51.100.1, 203.0.113.7'];
        self::assertSame('203.0.113.7', Request::clientIp($server, 'HTTP_X_FORWARDED_FOR', self::PROXIES), 'right-most entry');

        $direct = ['REMOTE_ADDR' => '192.0.2.50', 'HTTP_X_FORWARDED_FOR' => '203.0.113.7'];
        self::assertSame('192.0.2.50', Request::clientIp($direct, 'HTTP_X_FORWARDED_FOR', self::PROXIES), 'spoofed by a visitor');
    }

    public function testIgnoresAnInvalidForwardedAddress(): void
    {
        $server = ['REMOTE_ADDR' => '10.1.2.3', 'HTTP_X_FORWARDED_FOR' => 'not-an-ip'];
        self::assertSame('10.1.2.3', Request::clientIp($server, 'HTTP_X_FORWARDED_FOR', self::PROXIES));
    }

    public function testMatchesCidrRanges(): void
    {
        self::assertTrue(IpRange::matches('10.255.0.1', '10.0.0.0/8'));
        self::assertFalse(IpRange::matches('11.0.0.1', '10.0.0.0/8'));
        self::assertTrue(IpRange::matches('192.168.1.130', '192.168.1.128/25'));
        self::assertFalse(IpRange::matches('192.168.1.127', '192.168.1.128/25'));
        self::assertTrue(IpRange::matches('203.0.113.7', '203.0.113.7'));
        self::assertTrue(IpRange::matches('2001:db8:1::5', '2001:db8::/32'));
        self::assertFalse(IpRange::matches('10.0.0.1', '2001:db8::/32'), 'IPv4 never matches an IPv6 range');
        self::assertFalse(IpRange::isValid('10.0.0.0/33'));
        self::assertFalse(IpRange::isValid('example.com'));
    }
}
