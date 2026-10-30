<?php

// Contact form endpoint (POST /api/contact). No code or secrets here: it loads
// the private server folder named by SCS_SERVER_DIR (SetEnv in .htaccess), or
// ../../scs-server, and refuses to run if that folder is web-accessible.

declare(strict_types=1);

ini_set('display_errors', '0');

$configured = $_SERVER['SCS_SERVER_DIR'] ?? $_SERVER['REDIRECT_SCS_SERVER_DIR'] ?? getenv('SCS_SERVER_DIR');
$dir = realpath((string) ($configured ?: dirname(__DIR__, 2) . '/scs-server'));
$root = realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? '')) ?: dirname(__DIR__);
$norm = static fn (string $p): string => rtrim(str_replace('\\', '/', $p), '/') . '/';
$exposed = $dir === false
    || str_starts_with($norm($dir), $norm($root))
    || str_contains($norm($dir), '/public_html/');

if ($exposed || !is_file($dir . '/bootstrap.php')) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo '{"ok":false,"error":"unavailable"}';
    exit;
}

(require $dir . '/bootstrap.php')();
