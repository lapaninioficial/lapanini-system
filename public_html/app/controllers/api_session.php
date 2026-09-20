<?php

declare(strict_types=1);

json_response([
    'ok' => true,
    'csrf' => csrf_token(),
    'user' => current_user() ? public_user(current_user()) : null,
    'admin' => current_admin(),
]);
