<?php

declare(strict_types=1);

function current_user(): ?array
{
    $id = $_SESSION['user_id'] ?? null;
    if (!$id) {
        return null;
    }
    $users = read_json_file(storage_json('users'), []);
    foreach ($users as $user) {
        if ((int) ($user['id'] ?? 0) === (int) $id) {
            unset($user['password_hash']);
            return $user;
        }
    }
    return null;
}

function current_admin(): ?array
{
    $id = $_SESSION['admin_id'] ?? null;
    if (!$id) {
        return null;
    }
    $admins = read_json_file(storage_json('admins'), []);
    foreach ($admins as $admin) {
        if ((int) ($admin['id'] ?? 0) === (int) $id) {
            unset($admin['password_hash']);
            return $admin;
        }
    }
    return null;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) {
        json_response(['ok' => false, 'error' => 'Não autenticado.'], 401);
    }
    return $user;
}

function require_admin(): array
{
    $admin = current_admin();
    if (!$admin) {
        json_response(['ok' => false, 'error' => 'Acesso administrativo necessário.'], 401);
    }
    return $admin;
}

function public_user(array $user): array
{
    return [
        'id' => (int) ($user['id'] ?? 0),
        'name' => (string) ($user['name'] ?? ''),
        'email' => (string) ($user['email'] ?? ''),
        'phone' => (string) ($user['phone'] ?? ''),
        'address_line' => (string) ($user['address_line'] ?? ''),
        'address_number' => (string) ($user['address_number'] ?? ''),
        'address_complement' => (string) ($user['address_complement'] ?? ''),
    ];
}
