<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Scs\Contact\ContactSubmission;
use Scs\Contact\ContactValidator;

final class ContactValidatorTest extends TestCase
{
    private const VALID = [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'We need a new booking site for our clinic.',
    ];

    /** @param array<string, mixed> $overrides */
    private static function errors(array $overrides = [], ?ContactValidator $v = null): array
    {
        $s = ContactSubmission::fromInput($overrides + self::VALID);
        return ($v ?? new ContactValidator())->validate($s);
    }

    public function testAcceptsAValidSubmission(): void
    {
        self::assertSame([], self::errors());
    }

    public function testMatchesTheFrontEndMessages(): void
    {
        self::assertSame([
            'name' => 'Please enter your name.',
            'email' => 'Enter a valid email address.',
            'message' => 'Tell us a bit more — at least 10 characters.',
        ], self::errors(['name' => ' J ', 'email' => 'nope', 'message' => 'short']));
    }

    /** @return iterable<string, array{string}> */
    public static function injectedNames(): iterable
    {
        yield 'LF' => ["Jane\nBcc: victim@example.com"];
        yield 'CRLF' => ["Jane\r\nBcc: victim@example.com"];
        yield 'NUL' => ["Jane\0Doe"];
        yield 'line separator' => ["Jane\u{2028}Doe"];
    }

    #[DataProvider('injectedNames')]
    public function testRejectsLineBreaksAndControlCharactersInTheName(string $name): void
    {
        self::assertArrayHasKey('name', self::errors(['name' => $name]));
    }

    /** @return iterable<string, array{string}> */
    public static function badEmails(): iterable
    {
        yield 'header injection' => ["jane@example.com\r\nBcc: victim@example.com"];
        yield 'trailing LF' => ["jane@example.com\n"  . 'x'];
        yield 'no TLD' => ['jane@localhost'];
        yield 'one-letter TLD' => ['jane@example.c'];
        yield 'two at signs' => ['jane@@example.com'];
        yield 'display name' => ['Jane <jane@example.com>'];
        yield 'too long' => [str_repeat('a', 250) . '@example.com'];
    }

    #[DataProvider('badEmails')]
    public function testRejectsInvalidEmails(string $email): void
    {
        self::assertArrayHasKey('email', self::errors(['email' => $email]));
    }

    public function testEnforcesMaximumLengths(): void
    {
        self::assertSame(
            'Please keep your name under 100 characters.',
            self::errors(['name' => str_repeat('é', 101)])['name'] ?? null,
        );
        self::assertSame([], self::errors(['name' => str_repeat('é', 100)]), 'counts characters, not bytes');
        self::assertSame(
            'Please keep your message under 5,000 characters.',
            self::errors(['message' => str_repeat('a', 5001)])['message'] ?? null,
        );
    }

    public function testIgnoresNonStringFields(): void
    {
        self::assertSame(
            ['name', 'email', 'message'],
            array_keys(self::errors(['name' => ['x'], 'email' => 42, 'message' => null])),
        );
    }

    public function testPhoneIsOptional(): void
    {
        self::assertSame([], self::errors(['phone' => ['digits' => '1', 'dialCode' => '1']]));
        self::assertSame([], self::errors(['phone' => []]));
    }

    /** @return iterable<string, array{string, string, bool}> */
    public static function phones(): iterable
    {
        yield 'US complete' => ['19545592944', '1', true];
        yield 'US short' => ['1954559294', '1', false];
        yield 'UK mobile' => ['447700900123', '44', true];
        yield 'Colombia mobile' => ['573001234567', '57', true];
        yield 'too short' => ['4477009', '44', false];
        yield 'too long' => ['4412345678901234', '44', false];
    }

    #[DataProvider('phones')]
    public function testValidatesPhonesLikeTheFrontEnd(string $digits, string $dial, bool $valid): void
    {
        $errors = self::errors(['phone' => ['digits' => $digits, 'dialCode' => $dial]]);
        self::assertSame($valid, !isset($errors['phone']));
    }

    public function testStripsControlCharactersFromTheMessageButKeepsLineBreaks(): void
    {
        $s = ContactSubmission::fromInput(['message' => "Line one\r\nLine\x0B two\tend\x07"] + self::VALID);
        self::assertSame("Line one\nLine two\tend", $s->message);
    }

    public function testScreensMessagesWithTooManyLinks(): void
    {
        $v = new ContactValidator(maxLinks: 3);
        $three = 'See https://a.example, http://b.example and www.c.example please';
        self::assertSame([], $v->screen(ContactSubmission::fromInput(['message' => $three] + self::VALID)));

        $four = $three . ' and https://d.example';
        $flag = $v->screen(ContactSubmission::fromInput(['message' => $four] + self::VALID));
        self::assertSame('links', $flag['reason']);
        self::assertSame('Please include no more than 3 links.', $flag['message']);
    }

    public function testScreensBlockedTermsCaseInsensitively(): void
    {
        $v = new ContactValidator(blockedTerms: ['backlinks']);
        $flag = $v->screen(ContactSubmission::fromInput(['message' => 'Cheap BACKLINKS for your site'] + self::VALID));
        self::assertSame('blocked_term', $flag['reason']);
        self::assertSame([], $v->screen(ContactSubmission::fromInput(self::VALID)));
    }
}
