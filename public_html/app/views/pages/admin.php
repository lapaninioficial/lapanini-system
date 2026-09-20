<?php require APP_PATH . '/views/partials/head.php'; ?>
<header class="header">
  <a class="brand" href="<?= e(url()) ?>" aria-label="La Panini — página inicial"><img src="<?= e(asset('img/logo-marca-lapanini.webp')) ?>" alt="La Panini"></a>
  <span class="open">Painel da cozinha</span>
</header>
<main class="policy-page" id="adminApp">
  <a class="policy-back" href="<?= e(url()) ?>">← Voltar para o site</a>
  <h1>Painel da cozinha</h1>
  <span class="policy-updated">Pedidos em tempo real no servidor — autenticação por sessão PHP.</span>
  <div id="adminLogin">
    <form id="adminForm" class="account-form">
      <label>E-mail<input type="email" name="email" required autocomplete="username"></label>
      <label>Senha<input type="password" name="password" required minlength="10" autocomplete="current-password"></label>
      <button class="primary" type="submit">Entrar no painel</button>
      <small>Use as credenciais administrativas do servidor. A senha nunca fica no navegador.</small>
    </form>
  </div>
  <div id="adminBoard" hidden>
    <p>Pedidos recebidos pela API. Atualize o status para a equipe e o cliente acompanharem.</p>
    <div id="adminOrders"><div class="loading">Carregando pedidos…</div></div>
    <button type="button" id="adminLogout">Sair do painel</button>
  </div>
</main>
<script>window.LAPANINI = { csrf: <?= json_encode(csrf_token()) ?>, api: <?= json_encode(url('api')) ?> };</script>
<script src="<?= e(asset('js/admin.js')) ?>?v=1" defer></script>
</body>
</html>
