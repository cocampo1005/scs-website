// Pre-flight for release builds (`npm run build:release`, `npm run package:release`).
// The contact form posts to the PHP endpoint, so a release needs that file, its
// .htaccess rules and the server's locked dependencies, and no EmailJS left.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const problems = [];

if (!existsSync(join(root, "public/api/contact.php"))) {
  problems.push("public/api/contact.php is missing");
}

const htaccess = read("public/.htaccess");
for (const rule of ["RewriteRule ^api/contact/?$ api/contact.php [L]", "RewriteRule ^api(/|$) - [R=404,L]"]) {
  if (!htaccess.includes(rule)) problems.push(`public/.htaccess lacks \`${rule}\``);
}

if (!existsSync(join(root, "server/composer.lock"))) {
  problems.push("server/composer.lock is missing (run `composer update` in server/)");
}
if (!existsSync(join(root, "server/vendor/autoload.php"))) {
  problems.push("server/vendor is not installed (run `composer install` in server/)");
}

function* sourceFiles(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    // Tests may name EmailJS to assert it is gone
    if (entry.isDirectory()) entry.name !== "__tests__" && (yield* sourceFiles(path));
    else if (/\.(jsx?|mjs|html)$/.test(entry.name) && !/\.test\./.test(entry.name)) yield path;
  }
}
const pkg = JSON.parse(read("package.json"));
if (pkg.dependencies?.["@emailjs/browser"]) problems.push("@emailjs/browser is still a dependency");
for (const file of [...sourceFiles("src"), "index.html"]) {
  if (/emailjs|VITE_EMAILJS/i.test(read(file))) problems.push(`${file} still references EmailJS`);
}

if (problems.length) {
  console.error(`Release check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("Release check OK.");
