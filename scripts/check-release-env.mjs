// Guards release builds: the contact form needs the EmailJS settings, which
// Vite inlines at build time from .env.local (or the environment). A build
// without them deploys a form that cannot send.
import { loadEnv } from "vite";

const REQUIRED = [
  "VITE_EMAILJS_SERVICE_ID",
  "VITE_EMAILJS_TEMPLATE_ID",
  "VITE_EMAILJS_PUBLIC_KEY",
];

const env = loadEnv("production", process.cwd(), "VITE_");
const missing = REQUIRED.filter((name) => !env[name]);

if (missing.length) {
  console.error(
    `Release build stopped: missing ${missing.join(", ")}.\n` +
      "Add them to .env.local (see .env.example) and run `npm run build:release` again."
  );
  process.exit(1);
}
console.log("Release environment OK.");
