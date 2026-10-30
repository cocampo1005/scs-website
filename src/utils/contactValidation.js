// Contact form validation. Pure functions so the rules can be unit tested.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onlyDigits = (s = "") => s.replace(/\D/g, "");

export function isEmail(value = "") {
  return EMAIL_RE.test(value.trim());
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
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = "Enter a valid email address.";
  if (message.trim().length < 10)
    errors.message = "Tell us a bit more — at least 10 characters.";
  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}
