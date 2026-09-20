<?php

declare(strict_types=1);

$input = json_input();
if (!csrf_verify($input['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null))) {
    json_response(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
}

$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

$users = read_json_file(storage_json('users'), []);
$found = null;
foreach ($users as $user) {
    if (strtolower((string) ($user['email'] ?? '')) === $email) {
        $found = $user;
        break;
    }
}

if (!$found || !password_verify($password, (string) ($found['password_hash'] ?? ''))) {
    json_response(['ok' => false, 'error' => 'E-mail ou senha inválidos.'], 401);
}

$_SESSION['user_id'] = (int) $found['id'];
session_regenerate_id(true);

json_response(['ok' => true, 'user' => public_user($found)]);
