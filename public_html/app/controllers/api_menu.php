<?php

declare(strict_types=1);

$menu = read_json_file(storage_json('menu'), []);
$menu['customer'] = current_user() ? public_user(current_user()) : null;
json_response(['ok' => true, 'data' => $menu]);
