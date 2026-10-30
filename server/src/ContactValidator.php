<?php

declare(strict_types=1);

namespace Scs\Contact;

use PHPMailer\PHPMailer\PHPMailer;

/**
 * Server-side copy of src/utils/contactValidation.js. Field messages match the
 * front end so a server error reads the same as a client one.
 */
final class ContactValidator
{
    public const NAME_MAX = 100;
    public const EMAIL_MAX = 254;
    public const MESSAGE_MIN = 10;
    public const MESSAGE_MAX = 5000;

    // Control characters plus the Unicode line and paragraph separators
    private const LINE_BREAKS_OR_CONTROL = '/[\p{Cc}\x{2028}\x{2029}]/u';

    /**
     * @param list<string> $blockedTerms Lower-case phrases that reject a message
     */
    public function __construct(
        private readonly int $maxLinks = 3,
        private readonly array $blockedTerms = [],
    ) {
    }

    /** @return array<string, string> Field name => message; empty when valid */
    public function validate(ContactSubmission $s): array
    {
        $errors = [];

        $nameLength = mb_strlen($s->name);
        if ($nameLength < 2 || preg_match(self::LINE_BREAKS_OR_CONTROL, $s->name)) {
            $errors['name'] = 'Please enter your name.';
        } elseif ($nameLength > self::NAME_MAX) {
            $errors['name'] = 'Please keep your name under 100 characters.';
        }

        if (!self::isEmail($s->email)) {
            $errors['email'] = 'Enter a valid email address.';
        }

        $messageLength = mb_strlen($s->message);
        if ($messageLength < self::MESSAGE_MIN) {
            $errors['message'] = 'Tell us a bit more — at least 10 characters.';
        } elseif ($messageLength > self::MESSAGE_MAX) {
            $errors['message'] = 'Please keep your message under 5,000 characters.';
        }

        if ($s->hasPhone() && !self::isCompletePhone($s->phoneDigits, $s->phoneDialCode)) {
            $errors['phone'] = 'Please enter a complete phone number, including the area code.';
        }

        return $errors;
    }

    /**
     * Spam heuristics, run after validation passes.
     *
     * @return array<string, string> Field errors, plus the reason code under 'reason'
     */
    public function screen(ContactSubmission $s): array
    {
        $links = preg_match_all('~https?://|www\.~i', $s->message);
        if ($links > $this->maxLinks) {
            return ['message' => "Please include no more than {$this->maxLinks} links.", 'reason' => 'links'];
        }

        $haystack = mb_strtolower($s->name . "\n" . $s->message);
        foreach ($this->blockedTerms as $term) {
            if ($term !== '' && str_contains($haystack, mb_strtolower($term))) {
                return [
                    'message' => 'We couldn’t accept this message. Please email us directly.',
                    'reason' => 'blocked_term',
                ];
            }
        }

        return [];
    }

    public static function isEmail(string $email): bool
    {
        return strlen($email) <= self::EMAIL_MAX
            && !preg_match(self::LINE_BREAKS_OR_CONTROL, $email)
            // Same shape the front end requires: a dot and a 2+ character TLD
            && preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/', $email) === 1
            && PHPMailer::validateAddress($email, 'php');
    }

    /** North American (+1) numbers are exactly 11 digits; E.164 allows 8–15. */
    public static function isCompletePhone(string $digits, string $dialCode): bool
    {
        $length = strlen($digits);
        return $dialCode === '1' ? $length === 11 : $length >= 8 && $length <= 15;
    }
}
