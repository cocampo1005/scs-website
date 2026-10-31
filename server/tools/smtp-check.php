<?php
/**
 * One-off SMTP login check with the production config.php. Connects, starts
 * TLS, authenticates and quits: no email is sent and the contact form's rate
 * limits are untouched. Prints only the safe summary (codes, mechanism,
 * endpoint, the username's domain, whether the password is set).
 *
 * Upload to public_html under an unguessable name, open it once, copy the
 * output, then DELETE it. Locates the private folder like api/contact.php.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$configured = $_SERVER['SCS_SERVER_DIR'] ?? $_SERVER['REDIRECT_SCS_SERVER_DIR'] ?? getenv('SCS_SERVER_DIR');
$dir = realpath((string) ($configured ?: dirname(__DIR__) . '/scs-server'));
if ($dir === false || !is_file($dir . '/vendor/autoload.php')) {
    exit("FAIL server folder not found\n");
}
require $dir . '/vendor/autoload.php';

use Scs\Contact\Config;
use Scs\Contact\Mail\MailFailure;
use Scs\Contact\Mail\SmtpTransport;

try {
    $config = Config::load($dir . '/config.php');
} catch (Throwable $e) {
    // config_missing / config_invalid:<keys>; never values
    exit('FAIL config ' . $e->getMessage() . "\n");
}
if ($config->transport !== 'smtp') {
    exit("FAIL config transport is not smtp\n");
}

try {
    echo 'OK   ', (new SmtpTransport($config->smtp, $config->from, $config->to))->verify(), "\n";
} catch (MailFailure $e) {
    echo 'FAIL ', $e->getMessage(), "\n";
}
echo "Done. DELETE this file now.\n";
