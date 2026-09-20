<?php

declare(strict_types=1);

require_admin();
$input = json_input();
if (!csrf_verify($input['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null))) {
    json_response(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
}

$id = (int) ($input['id'] ?? 0);
$status = (string) ($input['status'] ?? '');
$allowed = ['received', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
if ($id < 1 || !in_array($status, $allowed, true)) {
    json_response(['ok' => false, 'error' => 'Pedido ou status inválido.'], 422);
}

$orders = read_json_file(storage_json('orders'), []);
$updated = null;
foreach ($orders as &$order) {
    if ((int) $order['id'] === $id) {
        $order['status'] = $status;
        $order['updated_at'] = date('c');
        $updated = $order;
        break;
    }
}
unset($order);

if (!$updated) {
    json_response(['ok' => false, 'error' => 'Pedido não encontrado.'], 404);
}

write_json_file(storage_json('orders'), $orders);
json_response(['ok' => true, 'order' => $updated]);
