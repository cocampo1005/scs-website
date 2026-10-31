<?php

/**
 * Scripted one-session SMTP server for SmtpTransportTest. Prints its port,
 * accepts one connection, then prints what the client did: command verbs, the
 * AUTH line, and "AUTH-RESULT ok|fail". Credentials are checked, not printed.
 * It advertises what smtp.hostinger.com does: AUTH PLAIN LOGIN.
 *
 *   php fake-smtp.php <expected-password>
 */

declare(strict_types=1);

$expected = $argv[1] ?? '';
$server = stream_socket_server('tcp://127.0.0.1:0', $errno, $errstr);
if ($server === false) {
    fwrite(STDERR, "listen failed: {$errstr}\n");
    exit(1);
}
$name = (string) stream_socket_get_name($server, false);
echo substr($name, strrpos($name, ':') + 1), "\n";
fflush(STDOUT);

$conn = @stream_socket_accept($server, 10);
if ($conn === false) {
    exit(1);
}
$say = static function (string $reply) use ($conn): void {
    fwrite($conn, $reply . "\r\n");
};

$say('220 fake.test ESMTP');
$state = '';
while (($line = fgets($conn)) !== false) {
    $line = rtrim($line, "\r\n");
    if ($state === 'data') {
        if ($line === '.') {
            $state = '';
            $say('250 2.0.0 Ok: queued');
        }
        continue;
    }
    if ($state === 'user') {
        $state = 'pass';
        $say('334 UGFzc3dvcmQ6');
        continue;
    }
    if ($state === 'pass') {
        $state = '';
        $ok = base64_decode($line, true) === $expected;
        echo 'AUTH-RESULT ', $ok ? 'ok' : 'fail', "\n";
        // The reply text carries base64 on purpose: it must never reach a log
        $say($ok ? '235 2.7.0 Authentication successful' : '535 5.7.8 Error: authentication failed: UGFzc3dvcmQ6');
        continue;
    }

    $verb = strtoupper((string) strtok($line, ' '));
    echo $verb === 'AUTH' ? strtoupper($line) : $verb, "\n";
    switch ($verb) {
        case 'EHLO':
            $say("250-fake.test\r\n250-PIPELINING\r\n250-AUTH PLAIN LOGIN\r\n250-ENHANCEDSTATUSCODES\r\n250 8BITMIME");
            break;
        case 'AUTH':
            if (strtoupper($line) === 'AUTH LOGIN') {
                $state = 'user';
                $say('334 VXNlcm5hbWU6');
            } else {
                $say('504 5.5.4 Unrecognized authentication type');
            }
            break;
        case 'MAIL':
        case 'RCPT':
            $say('250 2.1.0 Ok');
            break;
        case 'DATA':
            $state = 'data';
            $say('354 End data with <CR><LF>.<CR><LF>');
            break;
        case 'QUIT':
            $say('221 2.0.0 Bye');
            fclose($conn);
            exit(0);
        default:
            $say('502 5.5.2 Error: command not recognized');
    }
}
