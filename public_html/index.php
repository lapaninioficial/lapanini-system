<?php

declare(strict_types=1);

$candidates = [
    __DIR__ . '/app/bootstrap.php',
    dirname(__DIR__) . '/app/bootstrap.php',
];

$bootstrap = null;
foreach ($candidates as $file) {
    if (is_file($file)) {
        $bootstrap = $file;
        break;
    }
}

if ($bootstrap === null) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'La Panini: bootstrap não encontrado. Envie as pastas app/, config/ e storage/ um nível acima de public_html.';
    exit;
}

require $bootstrap;
dispatch();
