<?php

/**
 * Copy to config.php IN THE SERVER FOLDER (never in git, never under
 * public_html) and fill in the values there:
 *
 *   cp config.example.php config.php && chmod 600 config.php
 *
 * Staging and production each have their own server folder and config.php.
 */

return [
    // 'smtp' sends through the mailbox below; 'file' writes messages to
    // var/outbox/ instead (local development only)
    'transport' => 'smtp',

    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'encryption' => 'smtps', // 'smtps' (port 465) or 'starttls' (port 587)
        'username' => 'christian@solidcodesolutionsllc.com',
        'password' => '', // the mailbox password, set on the server only
        'timeout' => 10,
    ],

    // Must be the authenticated mailbox, so SPF and DKIM align
    'from' => ['address' => 'christian@solidcodesolutionsllc.com', 'name' => 'Solid Code Solutions website'],
    'to' => ['address' => 'christian@solidcodesolutionsllc.com', 'name' => 'Christian Ocampo'],

    // Exact scheme://host of the pages allowed to post. Staging:
    //   ['https://staging.solidcodesolutionsllc.com']
    'allowed_origins' => [
        'https://solidcodesolutionsllc.com',
        'https://www.solidcodesolutionsllc.com',
    ],

    // Random secret for hashing IP addresses (64 hex characters). Generate with:
    //   php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
    'ip_salt' => '',

    // Leave null unless the probe shows a CDN or proxy in front of PHP; then
    // the $_SERVER key carrying the visitor IP, e.g. 'HTTP_X_FORWARDED_FOR'.
    // The header is used only when the connecting address (REMOTE_ADDR) is in
    // trusted_proxies (IPs or CIDRs of that proxy); otherwise REMOTE_ADDR is.
    'client_ip_header' => null,
    'trusted_proxies' => [],

    // e.g. '[staging] ' so test messages are easy to tell apart
    'subject_prefix' => '',
    'timezone' => 'America/New_York',

    'limits' => [
        // Messages actually handed to SMTP (SMTP failures included)
        'per_client_per_hour' => 5,
        'site_per_day' => 30,
        // Every POST, whatever the outcome (invalid, trapped, wrong origin, ...)
        'attempts_per_client' => 20,
        'attempts_window' => 600, // seconds
        'attempts_site_per_hour' => 300,
        'min_fill_ms' => 3000, // faster submissions are treated as bots
        'max_links' => 3,
    ],

    // Case-insensitive phrases that reject a message (checked in name and message)
    'blocked_terms' => [
        'casino',
        'viagra',
        'crypto airdrop',
        'backlinks',
    ],
];
