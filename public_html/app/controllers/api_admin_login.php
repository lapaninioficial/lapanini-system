<?php

declare(strict_types=1);

$input = json_input();
if (!csrf_verify($input['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null))) {
    json_response(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
}

$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');
$admins = read_json_file(storage_json('admins'), []);
$found = null;
foreach ($admins as $admin) {
    if (strtolower((string) ($admin['email'] ?? '')) === $email) {
        $found = $admin;
        break;
    }
}

if (!$found || !password_verify($password, (string) ($found['password_hash'] ?? ''))) {
    json_response(['ok' => false, 'error' => 'Credenciais administrativas inválidas.'], 401);
}

$_SESSION['admin_id'] = (int) $found['id'];
session_regenerate_id(true);
unset($found['password_hash']);
json_response(['ok' => true, 'admin' => $found]);
