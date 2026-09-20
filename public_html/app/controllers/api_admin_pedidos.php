<?php

declare(strict_types=1);

require_admin();
$orders = read_json_file(storage_json('orders'), []);
json_response(['ok' => true, 'orders' => $orders]);
