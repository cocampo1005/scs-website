<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use PHPUnit\Framework\TestCase;
use RuntimeException;
use Scs\Contact\Config;

final class ConfigTest extends TestCase
{
    public function testTheExampleNeedsOnlyThePasswordAndSalt(): void
    {
        $example = require dirname(__DIR__) . '/config.example.php';

        try {
            Config::fromArray($example);
            self::fail('the example must not be usable as-is');
        } catch (RuntimeException $e) {
            self::assertSame('config_invalid:ip_salt,smtp.password', $e->getMessage());
        }

        $example['ip_salt'] = bin2hex(random_bytes(32));
        $example['smtp']['password'] = 'set-on-server';
        $config = Config::fromArray($example);
        self::assertSame('smtp', $config->transport);
        self::assertSame(465, $config->smtp['port']);
    }

    public function testErrorsNameKeysButNeverValues(): void
    {
        try {
            Config::fromArray([
                'allowed_origins' => ['https://example.com'],
                'ip_salt' => 'short-secret-value',
                'smtp' => ['host' => 'smtp.example.com', 'port' => 465, 'encryption' => 'tls', 'username' => 'u', 'password' => 'hunter2'],
                'from' => ['address' => 'website@example.com'],
                'to' => ['address' => 'not-an-email'],
            ]);
            self::fail('expected an invalid config');
        } catch (RuntimeException $e) {
            self::assertSame('config_invalid:ip_salt,smtp.encryption,to.address', $e->getMessage());
            self::assertStringNotContainsString('hunter2', $e->getMessage());
            self::assertStringNotContainsString('short-secret', $e->getMessage());
        }
    }

    public function testMissingFile(): void
    {
        $this->expectExceptionMessage('config_missing');
        Config::load(__DIR__ . '/does-not-exist.php');
    }
}
