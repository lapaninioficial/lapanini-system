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

function app_config(?string $key = null, $default = null)
{
    static $config;
    if ($config === null) {
        $config = require CONFIG_PATH . '/app.php';
    }
    if ($key === null) {
        return $config;
    }
    return $config[$key] ?? $default;
}

function base_url(string $path = ''): string
{
    static $base;
    if ($base === null) {
        $configured = app_config('url');
        if ($configured) {
            $base = rtrim($configured, '/');
        } else {
            $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                || (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443)
                || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
            $scheme = $https ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $basePath = rtrim((string) (getenv('APP_BASE_PATH') ?: ''), '/');
            $base = $scheme . '://' . $host . $basePath;
        }
    }
    $path = ltrim($path, '/');
    return $path === '' ? $base : $base . '/' . $path;
}

function asset(string $path): string
{
    $path = ltrim($path, '/');
    if (str_starts_with($path, 'assets/')) {
        $path = substr($path, 7);
    }
    return base_url('assets/' . $path);
}

function url(string $path = ''): string
{
    return base_url(ltrim($path, '/'));
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function json_input(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return $_POST ?: [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST ?: [];
}

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function csrf_token(): string
{
    return (string) ($_SESSION['_csrf'] ?? '');
}

function csrf_verify(?string $token): bool
{
    $expected = (string) ($_SESSION['_csrf'] ?? '');
    return $expected !== '' && is_string($token) && hash_equals($expected, $token);
}

function request_path(): string
{
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';
    $basePath = rtrim((string) (getenv('APP_BASE_PATH') ?: ''), '/');
    if ($basePath !== '' && str_starts_with($path, $basePath)) {
        $path = substr($path, strlen($basePath)) ?: '/';
    }
    $path = '/' . ltrim($path, '/');
    return rtrim($path, '/') ?: '/';
}

function view(string $name, array $data = []): void
{
    extract($data, EXTR_SKIP);
    $file = APP_PATH . '/views/' . $name . '.php';
    if (!is_file($file)) {
        http_response_code(500);
        echo 'View não encontrada.';
        return;
    }
    require $file;
}

function storage_json(string $name): string
{
    return STORAGE_PATH . '/data/' . $name . '.json';
}

function read_json_file(string $path, $default = [])
{
    if (!is_readable($path)) {
        return $default;
    }
    $decoded = json_decode((string) file_get_contents($path), true);
    return is_array($decoded) ? $decoded : $default;
}

function write_json_file(string $path, $data): bool
{
    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $tmp = $path . '.tmp';
    $ok = file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    if ($ok === false) {
        return false;
    }
    return rename($tmp, $path);
}
