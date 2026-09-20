# lapanini-system

Site de delivery da La Panini, preparado para o Plano M da Hostgator (Apache + PHP + MySQL).

## Deploy (FTP)

Envie o **conteúdo** de `public_html/` para a pasta `public_html` do cPanel.

Copie `.env.example` para `.env` e preencha `APP_URL`, `DB_*`.
O MySQL entra na etapa seguinte (`database/schema.sql`). Até lá a API usa JSON em `storage/data/` com senha em hash e sessão PHP.

Painel da cozinha: `/admin`  
Login inicial: `tecnico@lapanini.com.br` — troque a senha no servidor após o primeiro acesso.

Arquivos órfãos (`app.js`, `style.css`, HTML antigo) ficam em `legacy/` e não sobem para produção.
