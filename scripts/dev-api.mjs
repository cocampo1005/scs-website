// Local contact endpoint: PHP's built-in server for public/ with server/ as the
// private folder. `npm run dev` proxies /api/contact here (vite.config.js).
// Messages go to server/var/outbox/ unless server/config.php says otherwise.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const DEV_API_PORT = 8787;

const root = resolve(import.meta.dirname, "..");
const serverDir = resolve(root, "server");
const configPath = resolve(serverDir, "config.php");

if (!existsSync(resolve(serverDir, "vendor/autoload.php"))) {
  console.error("Run `composer install` in server/ first.");
  process.exit(1);
}

if (!existsSync(configPath)) {
  // Development-only config: no SMTP, so nothing is ever sent from a laptop
  writeFileSync(
    configPath,
    `<?php

// Local development config written by scripts/dev-api.mjs (gitignored).
return [
    'transport' => 'file',
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'ip_salt' => '${randomBytes(32).toString("hex")}',
    'subject_prefix' => '[local] ',
    'timezone' => 'America/New_York',
    'limits' => ['per_client_per_hour' => 50, 'site_per_day' => 500],
];
`
  );
  console.log("Created server/config.php (file transport, writes to server/var/outbox/).");
}

const php = spawn("php", ["-S", `127.0.0.1:${DEV_API_PORT}`, "-t", resolve(root, "public")], {
  env: { ...process.env, SCS_SERVER_DIR: serverDir },
  stdio: "inherit",
});
php.on("error", (err) => {
  console.error(`Could not start PHP (${err.message}). Is php on your PATH?`);
  process.exit(1);
});
php.on("exit", (code) => process.exit(code ?? 0));
