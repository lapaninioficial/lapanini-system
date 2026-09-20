<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= e($title ?? 'La Panini') ?></title>
<meta name="description" content="<?= e($description ?? 'La Panini — lasanhas artesanais.') ?>">
<link rel="icon" type="image/svg+xml" href="<?= e(asset('img/la-panini.svg')) ?>">
<meta name="theme-color" content="#F26B21">
<link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
<meta name="csrf-token" content="<?= e(csrf_token()) ?>">
</head>
<body>
