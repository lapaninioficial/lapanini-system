<?php

declare(strict_types=1);

$input = json_input();
if (!csrf_verify($input['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null))) {
    json_response(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
}

$name = trim((string) ($input['name'] ?? ''));
$email = strtolower(trim((string) ($input['email'] ?? '')));
$phone = preg_replace('/\D+/', '', (string) ($input['phone'] ?? '')) ?? '';
$password = (string) ($input['password'] ?? '');

if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($phone) < 10 || strlen($password) < 10) {
    json_response(['ok' => false, 'error' => 'Preencha nome, WhatsApp, e-mail válido e senha com no mínimo 10 caracteres.'], 422);
}

$users = read_json_file(storage_json('users'), []);
foreach ($users as $user) {
    if (strtolower((string) ($user['email'] ?? '')) === $email) {
        json_response(['ok' => false, 'error' => 'Já existe uma conta com este e-mail.'], 409);
    }
}

$id = empty($users) ? 1 : (int) max(array_column($users, 'id')) + 1;
$user = [
    'id' => $id,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    'address_line' => '',
    'address_number' => '',
    'address_complement' => '',
    'created_at' => date('c'),
];
$users[] = $user;
write_json_file(storage_json('users'), $users);

$_SESSION['user_id'] = $id;
session_regenerate_id(true);

json_response(['ok' => true, 'user' => public_user($user)]);
