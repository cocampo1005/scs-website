// Builds the upload archives described in docs/staging.md (S4):
//
//   npm run package:release -- --target=staging --server-dir=/home/u…/domains/…/scs-server-staging
//
// Writes to release/:
//   site-<commit>-<target>.zip    web root contents (no .htaccess; never overwrite the server's)
//   server-<commit>.zip           private server folder (code + vendor, no config.php or var/)
//   htaccess.<target>             rules to merge into the server's .htaccess
//   SHA256SUMS
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

const root = resolve(import.meta.dirname, "..");
const out = join(root, "release");
const work = join(out, "work");

const { values: args } = parseArgs({
  options: {
    target: { type: "string", default: "staging" },
    "server-dir": { type: "string" },
  },
});
if (!["staging", "production"].includes(args.target)) {
  fail(`--target must be staging or production, not "${args.target}"`);
}

function fail(message) {
  console.error(`package:release: ${message}`);
  process.exit(1);
}

function run(command, cwd = root) {
  console.log(`> ${command}`);
  const { status } = spawnSync(command, { cwd, stdio: "inherit", shell: true });
  if (status !== 0) fail(`\`${command}\` failed`);
}

function git(...gitArgs) {
  return spawnSync("git", gitArgs, { cwd: root, encoding: "utf8" }).stdout.trim();
}

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

// --- version -----------------------------------------------------------------
const dirty = git("status", "--porcelain") !== "";
const version = git("rev-parse", "--short", "HEAD") + (dirty ? "-dirty" : "");
if (dirty) console.warn("Warning: uncommitted changes. Release candidates should come from a clean commit.");

// --- build the site ----------------------------------------------------------
run("node scripts/check-release.mjs");
run("npx vite build");

rmSync(out, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

const site = join(work, "site");
cpSync(join(root, "dist"), site, { recursive: true });
rmSync(join(site, ".htaccess"), { force: true });
if (args.target === "staging") {
  writeFileSync(join(site, "robots.txt"), "User-agent: *\nDisallow: /\n");
}

const siteFiles = [...files(site)].map((f) => relative(site, f).replaceAll("\\", "/"));
const php = siteFiles.filter((f) => f.endsWith(".php"));
if (php.join() !== "api/contact.php") fail(`unexpected PHP files in the site build: ${php.join(", ")}`);
for (const f of siteFiles.filter((f) => /\.(js|html)$/.test(f))) {
  if (/emailjs/i.test(readFileSync(join(site, f), "utf8"))) fail(`${f} still contains EmailJS`);
}

// --- server folder -----------------------------------------------------------
const server = join(work, "server");
mkdirSync(server);
for (const entry of ["bootstrap.php", "config.example.php", "composer.json", "composer.lock", "src"]) {
  cpSync(join(root, "server", entry), join(server, entry), { recursive: true });
}
run("composer install --no-dev --classmap-authoritative --no-interaction --no-progress", server);

const serverFiles = [...files(server)].map((f) => relative(server, f).replaceAll("\\", "/"));
const forbidden = serverFiles.filter((f) => /^(config\.php|var\/|tests\/)|(^|\/)\.env/.test(f));
if (forbidden.length) fail(`server archive would contain: ${forbidden.join(", ")}`);
if (serverFiles.some((f) => f.startsWith("vendor/phpunit/"))) fail("dev dependencies leaked into vendor/");

// --- .htaccess rules for the target ------------------------------------------
const placeholder = `/home/uXXXXXXXXX/domains/solidcodesolutionsllc.com/scs-server${args.target === "staging" ? "-staging" : ""}`;
const serverDir = args["server-dir"] ?? placeholder;
if (!args["server-dir"]) {
  console.warn(`Warning: no --server-dir given; htaccess.${args.target} uses the placeholder ${placeholder}.`);
}
if (/(^|\/)public_html(\/|$)/.test(serverDir)) fail("--server-dir must be outside public_html");

const header =
  args.target === "staging"
    ? `# Staging rules: paste BELOW the "Password Protect Directories" lines; keep those.\n` +
      `<IfModule mod_headers.c>\n  Header always set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n\n`
    : `# Production base rules: merge with the reviewed production .htaccess (docs/staging.md S0, S6).\n\n`;
writeFileSync(
  join(out, `htaccess.${args.target}`),
  `${header}# Private server folder for the contact endpoint (outside every document root)\n` +
    `SetEnv SCS_SERVER_DIR ${serverDir}\n\n` +
    readFileSync(join(root, "public/.htaccess"), "utf8")
);

// --- archives ----------------------------------------------------------------
const siteZip = join(out, `site-${version}-${args.target}.zip`);
const serverZip = join(out, `server-${version}.zip`);
run(`php scripts/make-zip.php "${site}" "${siteZip}"`);
run(`php scripts/make-zip.php "${server}" "${serverZip}"`);
rmSync(work, { recursive: true, force: true });

const sums = [siteZip, serverZip, join(out, `htaccess.${args.target}`)]
  .map((f) => `${createHash("sha256").update(readFileSync(f)).digest("hex")}  ${relative(out, f)}`)
  .join("\n");
writeFileSync(join(out, "SHA256SUMS"), sums + "\n");

console.log(`\nRelease ${version} (${args.target}) in ${relative(root, out)}/:\n${sums}`);
