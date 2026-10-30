<?php

/**
 * Entry point loaded by public/api/contact.php. Lives in the private server
 * folder, beside config.php, vendor/ and var/, never under a document root.
 */

declare(strict_types=1);

use Scs\Contact\Config;
use Scs\Contact\ContactHandler;
use Scs\Contact\ContactLog;
use Scs\Contact\Request;
use Scs\Contact\Response;

require __DIR__ . '/vendor/autoload.php';

return static function (): void {
    $varDir = __DIR__ . '/var';
    $log = new ContactLog($varDir . '/contact.log');

    try {
        $config = Config::load(__DIR__ . '/config.php');
        date_default_timezone_set($config->timezone);
        $response = ContactHandler::create($config, $varDir, $log)
            ->handle(Request::fromGlobals($config->clientIpHeader));
    } catch (Throwable $e) {
        // Config and storage problems: log a code, never the exception text
        $code = $e instanceof RuntimeException && str_starts_with($e->getMessage(), 'config_')
            ? $e->getMessage()
            : (new ReflectionClass($e))->getShortName();
        $log->record('error', '-', $code);
        $response = Response::error(503, 'unavailable');
    }

    $response->emit();
};
