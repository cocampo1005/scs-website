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
     */
    public static function fromGlobals(?string $clientIpHeader = null): self
    {
        // Read one byte past the limit so an oversized body is detectable
        $body = (string) file_get_contents('php://input', false, null, 0, self::MAX_BODY_BYTES + 1);

        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        if ($clientIpHeader !== null && !empty($_SERVER[$clientIpHeader])) {
            // In X-Forwarded-For style lists only the right-most entry, appended
            // by the proxy itself, can't be forged by the visitor
            $hops = explode(',', (string) $_SERVER[$clientIpHeader]);
            $ip = trim((string) end($hops));
        }

        return new self(
            method: strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            contentType: (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? ''),
            body: $body,
            origin: (string) ($_SERVER['HTTP_ORIGIN'] ?? ''),
            referer: (string) ($_SERVER['HTTP_REFERER'] ?? ''),
            clientIp: $ip,
            now: time(),
        );
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
