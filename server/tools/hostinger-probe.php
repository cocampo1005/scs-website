<?php
/**
 * One-off, read-only capability probe for the SMTP contact endpoint.
 *
 * Upload to public_html under an unguessable name (probe-<random>.php), open it
 * once in the browser, copy the output, then DELETE this file. It sends no
 * email, needs no credentials and writes only a temporary test file it removes
 * again.
 *
 * Expected private folder: a sibling of the domain's public_html, e.g.
 *   /home/uXXXX/domains/solidcodesolutionsllc.com/scs-server
 */

declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$out = [];
$ok = static function (bool $pass): string {
    return $pass ? 'OK  ' : 'FAIL';
};

// PHP and extensions
$out[] = '== PHP';
$out[] = $ok(PHP_VERSION_ID >= 80200) . ' version ' . PHP_VERSION . ' (need >= 8.2)';
$out[] = '     sapi ' . PHP_SAPI . ', server ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown');
foreach (['openssl', 'mbstring', 'filter', 'json', 'pdo_sqlite', 'ctype'] as $ext) {
    $out[] = $ok(extension_loaded($ext)) . " ext {$ext}";
}
$out[] = '     display_errors=' . var_export(ini_get('display_errors'), true)
    . ' log_errors=' . var_export(ini_get('log_errors'), true);
$out[] = '     max_execution_time=' . ini_get('max_execution_time')
    . ' default_socket_timeout=' . ini_get('default_socket_timeout');
$disabled = array_filter(array_map('trim', explode(',', (string) ini_get('disable_functions'))));
foreach (['stream_socket_client', 'fsockopen', 'flock', 'hash_hmac', 'random_bytes'] as $fn) {
    $out[] = $ok(function_exists($fn) && !in_array($fn, $disabled, true)) . " function {$fn}";
}
$out[] = '     open_basedir=' . (ini_get('open_basedir') ?: '(none)');

// Private folder outside the document root
$out[] = '';
$out[] = '== Private folder';
$docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) ?: __DIR__;
$out[] = '     document root ' . $docRoot;
$candidates = array_unique([
    dirname($docRoot) . '/scs-server',
    dirname($docRoot) . '/scs-server-staging',
]);
foreach ($candidates as $dir) {
    $inside = str_starts_with($dir . '/', rtrim($docRoot, '/') . '/');
    if (!is_dir($dir)) {
        $out[] = "     missing {$dir}";
        continue;
    }
    $probe = $dir . '/.probe-' . bin2hex(random_bytes(4));
    $writable = @file_put_contents($probe, 'x') === 1;
    if ($writable) {
        @unlink($probe);
    }
    $out[] = $ok(!$inside) . " outside document root: {$dir}";
    $out[] = $ok(is_readable($dir)) . ' readable';
    $out[] = $ok($writable) . ' writable (needed for var/ rate-limit store and log)';
}

// Proxy/CDN in front of PHP: decides config.php's client_ip_header. Header
// names only; values (IP addresses) are not printed.
$out[] = '';
$out[] = '== Client IP headers';
$out[] = '     REMOTE_ADDR is ' . (filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) ? 'a public address' : 'private/reserved (a proxy is in front)');
foreach (['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CF_CONNECTING_IP', 'HTTP_TRUE_CLIENT_IP', 'HTTP_X_CLIENT_IP'] as $h) {
    if (!empty($_SERVER[$h])) {
        $hops = count(explode(',', (string) $_SERVER[$h]));
        $out[] = "     present {$h} ({$hops} " . ($hops === 1 ? 'entry' : 'entries') . ')';
    }
}
$names = array_filter(array_keys($_SERVER), static fn ($k) => str_starts_with((string) $k, 'HTTP_'));
sort($names);
$out[] = '     request headers: ' . implode(' ', $names);
$out[] = '     REMOTE_ADDR equals the right-most X-Forwarded-For entry: '
    . (isset($_SERVER['HTTP_X_FORWARDED_FOR'])
        ? (trim((string) array_slice(explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']), -1)[0]) === ($_SERVER['REMOTE_ADDR'] ?? '') ? 'yes' : 'no')
        : 'n/a');

// SMTP reachability and certificate verification (no login, no email)
$out[] = '';
$out[] = '== SMTP connectivity (smtp.hostinger.com)';
foreach ([[465, 'ssl'], [587, 'tcp']] as [$port, $scheme]) {
    $ctx = stream_context_create(['ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'peer_name' => 'smtp.hostinger.com',
    ]]);
    $errno = 0;
    $errstr = '';
    $start = microtime(true);
    $sock = @stream_socket_client("{$scheme}://smtp.hostinger.com:{$port}", $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $ctx);
    $ms = (int) round((microtime(true) - $start) * 1000);
    if ($sock === false) {
        $out[] = "FAIL port {$port}: {$errno} {$errstr}";
        continue;
    }
    stream_set_timeout($sock, 8);
    $greeting = trim((string) fgets($sock, 512));
    $line = "port {$port} connected in {$ms} ms, greeting " . substr($greeting, 0, 3);
    if ($port === 587) {
        fwrite($sock, "EHLO probe.local\r\n");
        $caps = '';
        while (($l = fgets($sock, 512)) !== false) {
            $caps .= $l;
            if (preg_match('/^\d{3} /', $l)) {
                break;
            }
        }
        $line .= str_contains($caps, 'STARTTLS') ? ', STARTTLS offered' : ', no STARTTLS';
        fwrite($sock, "QUIT\r\n");
    } else {
        $line .= ', TLS certificate verified';
    }
    fclose($sock);
    $out[] = $ok(str_starts_with($greeting, '220')) . ' ' . $line;
}

$out[] = '';
$out[] = 'Done. Copy this output, then DELETE hostinger-probe.php from the server.';
echo implode("\n", $out), "\n";
