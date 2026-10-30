<?php

declare(strict_types=1);

namespace Scs\Contact;

/** IPv4/IPv6 address and CIDR matching for the trusted-proxy list. */
final class IpRange
{
    public static function isValid(string $range): bool
    {
        [$net, $bits] = array_pad(explode('/', $range, 2), 2, null);
        $packed = @inet_pton((string) $net);
        if ($packed === false) {
            return false;
        }
        return $bits === null || (ctype_digit($bits) && (int) $bits <= strlen($packed) * 8);
    }

    /** @param list<string> $ranges */
    public static function matchesAny(string $ip, array $ranges): bool
    {
        foreach ($ranges as $range) {
            if (self::matches($ip, $range)) {
                return true;
            }
        }
        return false;
    }

    public static function matches(string $ip, string $range): bool
    {
        if (!self::isValid($range)) {
            return false;
        }
        [$net, $bits] = array_pad(explode('/', $range, 2), 2, null);
        $addr = @inet_pton($ip);
        $netAddr = (string) inet_pton((string) $net);
        if ($addr === false || strlen($addr) !== strlen($netAddr)) {
            return false;
        }
        $bits = $bits === null ? strlen($addr) * 8 : (int) $bits;
        $bytes = intdiv($bits, 8);
        if (substr($addr, 0, $bytes) !== substr($netAddr, 0, $bytes)) {
            return false;
        }
        if ($bits % 8 === 0) {
            return true;
        }
        $mask = (0xFF << (8 - $bits % 8)) & 0xFF;
        return (ord($addr[$bytes]) & $mask) === (ord($netAddr[$bytes]) & $mask);
    }
}
