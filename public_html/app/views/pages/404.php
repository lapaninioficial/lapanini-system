<?php
$title = 'Página não encontrada — La Panini';
$description = 'A página pedida não existe.';
require APP_PATH . '/views/partials/head.php';
?>
<header class="header">
  <a class="brand" href="<?= e(url()) ?>" aria-label="La Panini — página inicial"><img src="<?= e(asset('img/logo-marca-lapanini.webp')) ?>" alt="La Panini"></a>
</header>
<main class="policy-page">
  <a class="policy-back" href="<?= e(url()) ?>">← Voltar para o site</a>
  <h1>Página não encontrada</h1>
  <p>Este endereço não existe no site da La Panini.</p>
</main>
</body>
</html>
