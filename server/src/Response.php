<?php

declare(strict_types=1);

namespace Scs\Contact;

final class Response
{
    /**
     * @param array<string, mixed>  $body
     * @param array<string, string> $headers
     */
    public function __construct(
        public readonly int $status,
        public readonly array $body,
        public readonly array $headers = [],
    ) {
    }

    public static function ok(): self
    {
        return new self(200, ['ok' => true]);
    }

    /**
     * @param array<string, mixed>  $extra
     * @param array<string, string> $headers
     */
    public static function error(int $status, string $error, array $extra = [], array $headers = []): self
    {
        return new self($status, ['ok' => false, 'error' => $error] + $extra, $headers);
    }

    public function emit(): void
    {
        http_response_code($this->status);
        header_remove('X-Powered-By');
        $headers = $this->headers + [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
            'X-Content-Type-Options' => 'nosniff',
            'X-Robots-Tag' => 'noindex, nofollow',
        ];
        foreach ($headers as $name => $value) {
            header("{$name}: {$value}");
        }
        echo json_encode($this->body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
