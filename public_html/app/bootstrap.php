<?php

declare(strict_types=1);

if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle): bool
    {
        return $needle === '' || strncmp((string) $haystack, (string) $needle, strlen((string) $needle)) === 0;
    }
}
if (!function_exists('str_contains')) {
    function str_contains($haystack, $needle): bool
    {
        return $needle === '' || strpos((string) $haystack, (string) $needle) !== false;
    }
}

define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('PUBLIC_PATH', ROOT_PATH);
define('STORAGE_PATH', ROOT_PATH . '/storage');
define('CONFIG_PATH', ROOT_PATH . '/config');

$envFile = ROOT_PATH . '/.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $value = trim($value, "\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

require APP_PATH . '/helpers.php';
require APP_PATH . '/database.php';
require APP_PATH . '/auth.php';
require APP_PATH . '/router.php';

$appConfig = require CONFIG_PATH . '/app.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name($appConfig['session']);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

if (empty($_SESSION['_csrf'])) {
    $_SESSION['_csrf'] = bin2hex(random_bytes(32));
}
