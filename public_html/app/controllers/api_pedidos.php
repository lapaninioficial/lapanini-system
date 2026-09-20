<?php

declare(strict_types=1);

$user = require_user();
$orders = read_json_file(storage_json('orders'), []);
$mine = array_values(array_filter($orders, static function ($order) use ($user) {
    $email = strtolower((string) ($order['customer']['email'] ?? ''));
    return $email === strtolower((string) $user['email']) || (int) ($order['user_id'] ?? 0) === (int) $user['id'];
}));

json_response(['ok' => true, 'orders' => $mine]);
