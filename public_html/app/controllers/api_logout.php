<?php

declare(strict_types=1);

unset($_SESSION['user_id']);
json_response(['ok' => true]);
