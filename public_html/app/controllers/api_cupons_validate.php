<?php

declare(strict_types=1);

$input = json_input();
$code = strtoupper(trim((string) ($input['code'] ?? $input['coupon_code'] ?? '')));
if ($code === '') {
    json_response(['ok' => false, 'error' => 'Digite um cupom.'], 422);
}

$coupons = read_json_file(storage_json('coupons'), []);
foreach ($coupons as $coupon) {
    if (strtoupper((string) $coupon['code']) === $code && !empty($coupon['active'])) {
        json_response([
            'ok' => true,
            'coupon' => [
                'code' => $coupon['code'],
                'percent' => (float) $coupon['percent'],
            ],
        ]);
    }
}

json_response(['ok' => false, 'error' => 'Cupom inválido ou expirado.'], 404);
