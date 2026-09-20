<?php

declare(strict_types=1);

$input = json_input();
if (!csrf_verify($input['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null))) {
    json_response(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
}

$items = $input['items'] ?? [];
if (!is_array($items) || $items === []) {
    json_response(['ok' => false, 'error' => 'Sua sacola está vazia.'], 422);
}

$name = trim((string) ($input['customer_name'] ?? ''));
$phone = trim((string) ($input['customer_phone'] ?? ''));
$email = strtolower(trim((string) ($input['customer_email'] ?? '')));
$fulfillment = ($input['fulfillment'] ?? 'delivery') === 'pickup' ? 'pickup' : 'delivery';

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Informe nome, WhatsApp e e-mail válidos.'], 422);
}

if ($fulfillment === 'delivery' && (trim((string) ($input['address_line'] ?? '')) === '' || trim((string) ($input['address_number'] ?? '')) === '')) {
    json_response(['ok' => false, 'error' => 'Informe o endereço e o número da entrega.'], 422);
}

$menu = read_json_file(storage_json('menu'), []);
$products = $menu['products'] ?? [];
$addons = $menu['addons'] ?? [];
$areas = $menu['areas'] ?? [];
$productById = [];
foreach ($products as $product) {
    $productById[(int) $product['id']] = $product;
}
$addonById = [];
foreach ($addons as $addon) {
    $addonById[(int) $addon['option_id']] = $addon;
}

$normalized = [];
$subtotal = 0.0;
foreach ($items as $item) {
    $pid = (int) ($item['product_id'] ?? 0);
    if (!isset($productById[$pid])) {
        continue;
    }
    $qty = max(1, min(20, (int) ($item['quantity'] ?? 1)));
    $unit = (float) $productById[$pid]['price'];
    $addonIds = [];
    foreach ((array) ($item['addons'] ?? []) as $addonId) {
        $addonId = (int) $addonId;
        if (isset($addonById[$addonId]) && (int) $addonById[$addonId]['product_id'] === $pid) {
            $unit += (float) $addonById[$addonId]['price'];
            $addonIds[] = $addonId;
        }
    }
    $normalized[] = [
        'product_id' => $pid,
        'name' => $productById[$pid]['name'],
        'quantity' => $qty,
        'addons' => $addonIds,
        'notes' => trim((string) ($item['notes'] ?? '')),
        'unit_price' => $unit,
    ];
    $subtotal += $unit * $qty;
}

if ($normalized === []) {
    json_response(['ok' => false, 'error' => 'Nenhum item válido no pedido.'], 422);
}

$couponCode = strtoupper(trim((string) ($input['coupon_code'] ?? '')));
$discount = 0.0;
if ($couponCode !== '') {
    $coupons = read_json_file(storage_json('coupons'), []);
    foreach ($coupons as $coupon) {
        if (strtoupper((string) $coupon['code']) === $couponCode && !empty($coupon['active'])) {
            $discount = $subtotal * (float) $coupon['percent'];
            break;
        }
    }
}

$fee = 0.0;
$areaId = (int) ($input['delivery_area_id'] ?? 0);
if ($fulfillment === 'delivery') {
    foreach ($areas as $area) {
        if ((int) $area['id'] === $areaId) {
            $fee = (float) $area['fee'];
            break;
        }
    }
}

$orders = read_json_file(storage_json('orders'), []);
$orderNumber = str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
$sessionUser = current_user();
$order = [
    'id' => empty($orders) ? 1 : (int) max(array_column($orders, 'id') ?: [0]) + 1,
    'order_number' => $orderNumber,
    'created_at' => date('c'),
    'status' => 'received',
    'user_id' => $sessionUser['id'] ?? null,
    'customer' => [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
    ],
    'fulfillment' => $fulfillment,
    'address' => $fulfillment === 'pickup'
        ? 'Retirada grátis (Rua Osvaldo Serra, 193)'
        : trim((string) $input['address_line']) . ', ' . trim((string) $input['address_number']) . (trim((string) ($input['address_complement'] ?? '')) !== '' ? ' — ' . trim((string) $input['address_complement']) : ''),
    'payment' => (string) ($input['payment_method'] ?? 'pix'),
    'coupon' => $couponCode !== '' ? $couponCode : null,
    'items' => $normalized,
    'subtotal' => $subtotal,
    'discount' => $discount,
    'delivery_fee' => $fee,
    'total' => $subtotal - $discount + $fee,
];

array_unshift($orders, $order);
write_json_file(storage_json('orders'), $orders);

json_response(['ok' => true, 'order' => $order]);
