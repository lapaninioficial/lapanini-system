<?php

declare(strict_types=1);

function dispatch(): void
{
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = request_path();

    if ($method === 'POST' && isset($_POST['_method'])) {
        $method = strtoupper((string) $_POST['_method']);
    }

    $routes = [
        'GET /' => 'home',
        'GET /privacidade' => 'privacidade',
        'GET /cookies' => 'cookies',
        'GET /termos' => 'termos',
        'GET /admin' => 'admin',
        'GET /api/menu' => 'api_menu',
        'GET /api/session' => 'api_session',
        'POST /api/login' => 'api_login',
        'POST /api/register' => 'api_register',
        'POST /api/logout' => 'api_logout',
        'GET /api/account' => 'api_account',
        'GET /api/pedidos' => 'api_pedidos',
        'POST /api/pedidos' => 'api_pedidos_create',
        'GET /api/cupons' => 'api_cupons',
        'POST /api/cupons' => 'api_cupons_validate',
        'GET /api/track' => 'api_track',
        'POST /api/track' => 'api_track',
        'POST /api/admin/login' => 'api_admin_login',
        'POST /api/admin/logout' => 'api_admin_logout',
        'GET /api/admin/pedidos' => 'api_admin_pedidos',
        'POST /api/admin/pedidos' => 'api_admin_pedidos_update',
    ];

    $aliases = [
        '/privacidade.html' => '/privacidade',
        '/cookies.html' => '/cookies',
        '/termos.html' => '/termos',
        '/index.html' => '/',
        '/api/login.php' => '/api/login',
        '/api/register.php' => '/api/register',
        '/api/logout.php' => '/api/logout',
        '/api/pedidos.php' => '/api/pedidos',
        '/api/menu.php' => '/api/menu',
        '/api/cupons.php' => '/api/cupons',
        '/api/account.php' => '/api/account',
        '/api/session.php' => '/api/session',
        '/api/track.php' => '/api/track',
    ];
    if (isset($aliases[$path])) {
        $path = $aliases[$path];
    }

    $key = $method . ' ' . $path;
    if (!isset($routes[$key]) && str_starts_with($path, '/api/')) {
        json_response(['ok' => false, 'error' => 'Endpoint não encontrado.'], 404);
    }

    $handler = $routes[$key] ?? null;
    if (!$handler) {
        http_response_code(404);
        view('pages/404');
        return;
    }

    $file = APP_PATH . '/controllers/' . $handler . '.php';
    if (!is_file($file)) {
        http_response_code(500);
        echo 'Controlador indisponível.';
        return;
    }
    require $file;
}
