// Contact form validation. Pure functions so the rules can be unit tested.
// The server repeats these rules (server/src/ContactValidator.php); keep the
// limits and messages in sync.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 5000;

export const onlyDigits = (s = "") => s.replace(/\D/g, "");

export function isEmail(value = "") {
  const email = value.trim();
  return email.length <= EMAIL_MAX && EMAIL_RE.test(email);
}

// Phone is optional. `digits` is the full international number without "+"
// (country code included), as the phone input reports it. E.164 numbers are at
// most 15 digits; North American (+1) numbers are exactly 11.
export function validatePhone({ digits = "", dialCode = "" } = {}) {
  if (!digits || digits === dialCode) return null;
  const complete =
    dialCode === "1"
      ? digits.length === 11
      : digits.length >= 8 && digits.length <= 15;
  return complete ? null : "Please enter a complete phone number, including the area code.";
}

export function validateContact({ name = "", email = "", message = "", phone } = {}) {
  const errors = {};
  const nameLength = [...name.trim()].length;
  const messageLength = [...message.trim()].length;
  if (nameLength < 2 || /[\p{Cc}\u2028\u2029]/u.test(name)) errors.name = "Please enter your name.";
  else if (nameLength > NAME_MAX) errors.name = "Please keep your name under 100 characters.";
  if (!isEmail(email)) errors.email = "Enter a valid email address.";
  if (messageLength < 10)
    errors.message = "Tell us a bit more — at least 10 characters.";
  else if (messageLength > MESSAGE_MAX)
    errors.message = "Please keep your message under 5,000 characters.";
  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}
