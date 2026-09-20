<?php

declare(strict_types=1);

$input = json_input();
$email = strtolower(trim((string) ($input['email'] ?? ($_GET['email'] ?? ''))));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Informe o e-mail usado na compra.'], 422);
}

$orders = read_json_file(storage_json('orders'), []);
$found = null;
foreach ($orders as $order) {
    if (strtolower((string) ($order['customer']['email'] ?? '')) === $email) {
        $found = $order;
        break;
    }
}

if (!$found) {
    json_response(['ok' => false, 'error' => 'Nenhum pedido encontrado com esse e-mail.'], 404);
}

json_response(['ok' => true, 'order' => $found]);
