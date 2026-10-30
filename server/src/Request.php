<?php

declare(strict_types=1);

namespace Scs\Contact;

final class Request
{
    /** Bodies above this are rejected with 413 */
    public const MAX_BODY_BYTES = 16384;

    public function __construct(
        public readonly string $method,
        public readonly string $contentType = '',
        public readonly string $body = '',
        public readonly string $origin = '',
        public readonly string $referer = '',
        public readonly string $clientIp = '',
        public readonly ?int $now = null,
    ) {
    }

    /**
     * @param string|null $clientIpHeader $_SERVER key holding the visitor's IP
     *                                    when a trusted proxy or CDN sits in front
     * @param list<string> $trustedProxies IPs/CIDRs allowed to set that header
     */
    public static function fromGlobals(?string $clientIpHeader = null, array $trustedProxies = []): self
    {
        // Read one byte past the limit so an oversized body is detectable
        $body = (string) file_get_contents('php://input', false, null, 0, self::MAX_BODY_BYTES + 1);

        return new self(
            method: strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            contentType: (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? ''),
            body: $body,
            origin: (string) ($_SERVER['HTTP_ORIGIN'] ?? ''),
            referer: (string) ($_SERVER['HTTP_REFERER'] ?? ''),
            clientIp: self::clientIp($_SERVER, $clientIpHeader, $trustedProxies),
            now: time(),
        );
    }

    /**
     * The visitor's address: REMOTE_ADDR, unless REMOTE_ADDR is a trusted proxy
     * and the proxy's header carries a valid address. Anyone can send the
     * header, so it is ignored from untrusted peers.
     *
     * @param array<string, mixed> $server
     * @param list<string> $trustedProxies
     */
    public static function clientIp(array $server, ?string $header, array $trustedProxies): string
    {
        $peer = (string) ($server['REMOTE_ADDR'] ?? '');
        if ($header === null || empty($server[$header]) || !IpRange::matchesAny($peer, $trustedProxies)) {
            return $peer;
        }
        // In X-Forwarded-For style lists only the right-most entry, appended
        // by the proxy itself, can't be forged by the visitor
        $hops = explode(',', (string) $server[$header]);
        $ip = trim((string) end($hops));
        return filter_var($ip, FILTER_VALIDATE_IP) !== false ? $ip : $peer;
    }

    /** scheme://host[:port] of the page that sent the request, or '' */
    public function sourceOrigin(): string
    {
        if ($this->origin !== '') {
            return $this->origin === 'null' ? '' : rtrim($this->origin, '/');
        }
        $parts = parse_url($this->referer);
        if (!isset($parts['scheme'], $parts['host'])) {
            return '';
        }
        return $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    }

    public function isJson(): bool
    {
        return preg_match('~^application/json\s*(;|$)~i', $this->contentType) === 1;
    }
}
