<?php

return [
    'name' => 'La Panini',
    'env' => getenv('APP_ENV') ?: 'production',
    'url' => rtrim(getenv('APP_URL') ?: '', '/'),
    'whatsapp' => getenv('WHATSAPP_NUMBER') ?: '5519994048354',
    'session' => 'lapanini_sess',
    'admin_session' => 'lapanini_admin',
];
