<?php

declare(strict_types=1);

namespace Scs\Contact;

/**
 * The visitor's form fields, coerced to strings and trimmed. Nothing here is
 * trusted until ContactValidator has passed it.
 */
final class ContactSubmission
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $message,
        public readonly string $phoneDigits = '',
        public readonly string $phoneDialCode = '',
        public readonly string $phoneDisplay = '',
    ) {
    }

    /** @param array<mixed> $input Decoded JSON body */
    public static function fromInput(array $input): self
    {
        $phone = is_array($input['phone'] ?? null) ? $input['phone'] : [];

        // Keep line breaks and tabs in the message; drop other control characters.
        $message = str_replace(["\r\n", "\r"], "\n", self::string($input['message'] ?? ''));
        $message = (string) preg_replace('/[^\P{Cc}\n\t]/u', '', $message);

        return new self(
            name: trim(self::string($input['name'] ?? '')),
            email: trim(self::string($input['email'] ?? '')),
            message: trim($message),
            phoneDigits: self::digits($phone['digits'] ?? ''),
            phoneDialCode: self::digits($phone['dialCode'] ?? ''),
            phoneDisplay: trim(self::string($phone['display'] ?? '')),
        );
    }

    /** The phone field counts as filled once it holds more than the country code. */
    public function hasPhone(): bool
    {
        return $this->phoneDigits !== '' && $this->phoneDigits !== $this->phoneDialCode;
    }

    private static function string(mixed $value): string
    {
        return is_string($value) ? $value : '';
    }

    private static function digits(mixed $value): string
    {
        return (string) preg_replace('/\D/', '', self::string($value));
    }
}
