<?php require APP_PATH . '/views/partials/head.php'; ?>
<header class="header">
  <a class="brand" href="<?= e(url()) ?>" aria-label="La Panini — página inicial"><img src="<?= e(asset('img/logo-marca-lapanini.webp')) ?>" alt="La Panini"></a>
</header>
<main class="policy-page">
  <a class="policy-back" href="<?= e(url()) ?>">← Voltar para o site</a>
  <h1>Política de Privacidade</h1>
  <span class="policy-updated">Última atualização: setembro de 2026</span>
  <p>A La Panini respeita a sua privacidade e está comprometida com a proteção dos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Esta política explica quais dados coletamos, por que coletamos e como você pode exercer seus direitos.</p>
  <h2>1. Dados que coletamos</h2>
  <ul>
    <li>Nome, e-mail e WhatsApp, quando você cria uma conta ou faz um pedido;</li>
    <li>Endereço e complemento, para entrega dos pedidos;</li>
    <li>Histórico de pedidos, para melhor atendê-lo;</li>
    <li>Preferências de navegação (tema e sacola) armazenadas localmente no seu navegador.</li>
  </ul>
  <h2>2. Como usamos seus dados</h2>
  <ul>
    <li>Processar e entregar seus pedidos;</li>
    <li>Entrar em contato sobre status de pedidos;</li>
    <li>Autenticar sua conta no servidor (sessão PHP, senha com hash);</li>
    <li>Cumprir obrigações legais e fiscais.</li>
  </ul>
  <h2>3. Armazenamento</h2>
  <p>Dados de conta, pedidos e autenticação ficam no servidor. A senha nunca é gravada em texto puro. Sacola e tema podem ficar no dispositivo apenas para conveniência da compra.</p>
  <h2>4. Compartilhamento</h2>
  <p>Não vendemos nem compartilhamos seus dados com terceiros, exceto quando necessário para a entrega ou por obrigação legal.</p>
  <h2>5. Seus direitos</h2>
  <p>Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer momento, entrando em contato pelos canais abaixo.</p>
  <h2>6. Contato</h2>
  <p>Para dúvidas ou solicitações sobre privacidade: (19) 99404-8354 — Campinas · SP.</p>
</main>
<footer>
  <p>© <?= date('Y') ?> La Panini. Lasanhas artesanais, camadas generosas e sabor de verdade.</p>
</footer>
</body>
</html>
