<?php require APP_PATH . '/views/partials/head.php'; ?>
<header class="header">
  <a class="brand" href="<?= e(url()) ?>" aria-label="La Panini — página inicial"><img src="<?= e(asset('img/logo-marca-lapanini.webp')) ?>" alt="La Panini"></a>
</header>
<main class="policy-page">
  <a class="policy-back" href="<?= e(url()) ?>">← Voltar para o site</a>
  <h1>Política de Cookies</h1>
  <span class="policy-updated">Última atualização: setembro de 2026</span>
  <p>Na La Panini usamos cookie de sessão HTTP-only para autenticação no servidor e armazenamento local apenas para conveniência da compra. Não utilizamos cookies de rastreamento de terceiros.</p>
  <h2>1. O que fica no servidor</h2>
  <ul>
    <li><b>Sessão:</b> login do cliente e do painel da cozinha;</li>
    <li><b>Conta e pedidos:</b> persistidos no servidor, com senha em hash.</li>
  </ul>
  <h2>2. O que pode ficar no dispositivo</h2>
  <ul>
    <li><b>Sacola:</b> itens ainda não enviados, para não perder o pedido ao recarregar;</li>
    <li><b>Tema:</b> preferência entre tema escuro e claro.</li>
  </ul>
  <h2>3. Como controlar</h2>
  <p>Você pode encerrar a sessão pelo botão Sair. Preferências locais podem ser apagadas nas configurações do navegador.</p>
  <h2>4. Contato</h2>
  <p>Para dúvidas sobre esta política: (19) 99404-8354 — Campinas · SP.</p>
</main>
<footer>
  <p>© <?= date('Y') ?> La Panini. Lasanhas artesanais, camadas generosas e sabor de verdade.</p>
</footer>
</body>
</html>
