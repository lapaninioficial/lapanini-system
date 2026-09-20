<?php

declare(strict_types=1);

function db(): ?PDO
{
    static $pdo = false;
    if ($pdo !== false) {
        return $pdo;
    }

    $cfg = require CONFIG_PATH . '/database.php';
    if (empty($cfg['username']) || empty($cfg['database'])) {
        $pdo = null;
        return null;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $cfg['host'],
        $cfg['port'],
        $cfg['database'],
        $cfg['charset']
    );

    try {
        $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        $pdo = null;
        return null;
    }
}

function db_ready(): bool
{
    return db() instanceof PDO;
}
