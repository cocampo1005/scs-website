<?php
/**
 * One-off backend check with the production config.php, in two modes:
 *
 *   smtp-check-….php         load only: file fingerprints, Composer autoloader,
 *                            every class, config. Never contacts SMTP.
 *   smtp-check-….php?smtp=1  then also connects, starts TLS, authenticates and
 *                            quits. No email is sent and the contact form's
 *                            rate limits are untouched.
 *
 * Output is safe to share: phase results, 12-character SHA-256 prefixes of
 * the deployed code files (to compare with the release package), class names,
 * config key names, SMTP codes. Error messages go only to the server folder's
 * var/smtp-check.log (or PHP's error log when that folder isn't found); no
 * stack trace or argument values are written.
 *
 * Upload to public_html under an unguessable name, open it, copy the output,
 * then DELETE it. Locates the private folder like api/contact.php.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('zend.exception_ignore_args', '1');
header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$logFile = null;
$privateLog = static function (string $detail) use (&$logFile): void {
    $line = gmdate('c') . ' smtp-check ' . strtok($detail, "\n") . "\n";
    if ($logFile === null || @error_log($line, 3, $logFile) === false) {
        error_log(rtrim($line));
    }
};
$fail = static function (string $phase, Throwable $e) use ($privateLog): never {
    $privateLog(sprintf('%s: %s %s at %s:%d', $phase, $e::class, $e->getMessage(), $e->getFile(), $e->getLine()));
    http_response_code(500);
    exit(sprintf("FAIL %s %s@%s:%d (message in var/smtp-check.log)\n", $phase, (new ReflectionClass($e))->getShortName(), basename($e->getFile()), $e->getLine()));
};

// Fatal errors (a parse error in a deployed file) can't be caught
register_shutdown_function(static function () use ($privateLog): void {
    $e = error_get_last();
    if ($e === null || !in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR], true)) {
        return;
    }
    $privateLog(sprintf('fatal type=%d %s at %s:%d', $e['type'], $e['message'], $e['file'], $e['line']));
    echo 'FAIL php_fatal:', $e['type'], '@', basename($e['file']), ':', $e['line'], "\n";
});

$configured = $_SERVER['SCS_SERVER_DIR'] ?? $_SERVER['REDIRECT_SCS_SERVER_DIR'] ?? getenv('SCS_SERVER_DIR');
$dir = realpath((string) ($configured ?: dirname(__DIR__) . '/scs-server'));
if ($dir === false || !is_file($dir . '/vendor/autoload.php')) {
    exit("FAIL server folder not found\n");
}
if (is_dir($dir . '/var')) {
    $logFile = $dir . '/var/smtp-check.log';
}
echo 'PHP  ', PHP_VERSION, ', opcache ', function_exists('opcache_get_status') && @opcache_get_status(false) ? 'on' : 'off', "\n";

// 1. Fingerprints of the deployed code, to compare with the release package
echo "== files\n";
foreach ([
    'vendor/autoload.php',
    'vendor/composer/autoload_real.php',
    'vendor/composer/autoload_static.php',
    'vendor/composer/autoload_classmap.php',
    'vendor/composer/ClassLoader.php',
    'vendor/composer/platform_check.php',
    'bootstrap.php',
    'src/Config.php',
    'src/ContactHandler.php',
    'src/Request.php',
    'src/IpRange.php',
    'src/Mail/SmtpTransport.php',
    'src/Mail/SmtpDiagnostics.php',
] as $file) {
    $path = $dir . '/' . $file;
    printf("     %-40s %s\n", $file, is_file($path)
        ? substr((string) hash_file('sha256', $path), 0, 12) . ' ' . filesize($path) . 'B'
        : 'MISSING');
}
foreach ((array) glob($dir . '/vendor/composer/autoload_static*') as $extra) {
    if (basename((string) $extra) !== 'autoload_static.php') {
        echo '     stray file: vendor/composer/', basename((string) $extra), "\n";
    }
}

// 2. Composer autoloader
echo "== composer\n";
try {
    $loader = require $dir . '/vendor/autoload.php';
} catch (Throwable $e) {
    $fail('composer', $e);
}
$map = $loader->getClassMap();
echo 'OK   autoloader, ', count($map), " classes mapped, authoritative=", $loader->isClassMapAuthoritative() ? 'yes' : 'no', "\n";

// 3. Every application and PHPMailer class
echo "== classes\n";
$missing = [];
foreach (array_keys($map) as $class) {
    if (!str_starts_with($class, 'Scs\\') && !str_starts_with($class, 'PHPMailer\\')) {
        continue;
    }
    try {
        if (!class_exists($class) && !interface_exists($class)) {
            $missing[] = $class;
        }
    } catch (Throwable $e) {
        $fail('class ' . $class, $e);
    }
}
foreach (['Scs\\Contact\\Mail\\SmtpTransport', 'Scs\\Contact\\Mail\\SmtpDiagnostics', 'Scs\\Contact\\IpRange'] as $required) {
    if (!isset($map[$required])) {
        $missing[] = $required . ' (not in classmap)';
    }
}
echo $missing === [] ? "OK   all classes load\n" : 'FAIL ' . implode(', ', $missing) . "\n";
if ($missing !== []) {
    exit;
}

// 4. Config (key names only, never values)
echo "== config\n";
try {
    $config = Scs\Contact\Config::load($dir . '/config.php');
} catch (Throwable $e) {
    exit('FAIL config ' . ($e instanceof RuntimeException ? $e->getMessage() : $e::class) . "\n");
}
echo $config->transport === 'smtp' ? "OK   config.php valid, transport smtp\n" : "FAIL config transport is not smtp\n";

// 5. SMTP login, only when asked for
echo "== smtp\n";
if (($_GET['smtp'] ?? '') !== '1') {
    echo "skip (load-only; open with ?smtp=1 to test the login)\n";
} else {
    try {
        $summary = (new Scs\Contact\Mail\SmtpTransport($config->smtp, $config->from, $config->to))->verify();
        echo 'OK   ', $summary, "\n";
    } catch (Scs\Contact\Mail\MailFailure $e) {
        echo 'FAIL ', $e->getMessage(), "\n";
    } catch (Throwable $e) {
        $fail('smtp', $e);
    }
}
echo "Done. DELETE this file now.\n";
