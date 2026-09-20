<?php

declare(strict_types=1);

$coupons = read_json_file(storage_json('coupons'), []);
$public = array_map(static function ($coupon) {
    return [
        'code' => $coupon['code'],
        'percent' => (float) $coupon['percent'],
        'active' => !empty($coupon['active']),
    ];
}, array_filter($coupons, static fn ($c) => !empty($c['active'])));

json_response(['ok' => true, 'coupons' => array_values($public)]);
