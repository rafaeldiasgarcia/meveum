# AGENTS.md - Automacoes Meveum

## Objetivo

Esta pasta concentra a estrategia e a implementacao das automacoes do Meveum.
O foco atual e cobrir integracoes de backend e frontend com boa manutencao,
incluindo jornadas E2E completas quando elas agregarem sinal real.

## Direcao geral

- Respeitar a piramide de testes.
- Preferir teste unitario quando ele cobrir o comportamento com clareza.
- Criar automacao de integracao quando for preciso validar contratos,
  composicao entre camadas ou comportamento observavel no browser.
- Criar E2E apenas para jornadas criticas, sem duplicar combinacoes que ja
  foram cobertas por uma jornada mais completa.
- Manter testes pequenos, previsiveis e independentes.

## Stack esperada

- Playwright para automacoes web e de API.
- JavaScript em ES Modules.
- `import` / `export`, nunca `require`.

## Estrutura da pasta

```text
automations/
  AGENTS.md
  pages/
  services/
  fixtures/
  presets/
  tests/
    frontend/
    api/
    e2e/
  data/
```

## Responsabilidades

### `pages/`

- Encapsulam interacoes com DOM.
- Nunca chamam API, banco ou service.
- Exponham metodos de acao e validacao, nao detalhes de locator.

### `services/`

- Encapsulam chamadas HTTP, preparo de dados e, se necessario no futuro,
  integracoes controladas com persistencia de teste.
- Nunca acessam DOM.

### `fixtures/`

- Injetam pages, services e massas.
- Controlam setup e teardown do que for responsabilidade da automacao.
- Specs devem importar `test` das fixtures locais, nao direto do Playwright.

### `presets/`

- Montam estados reutilizaveis de teste a partir de fluxos reais.
- Criam dados dinamicamente via API, sem depender de seed fixo.
- Devem representar pre-condicoes recorrentes como usuario autenticado,
  loja preparada, catalogo completo, pedido existente e dashboard com
  movimento.

### `tests/`

- `tests/api/` para contratos e fluxos de integracao de backend.
- `tests/frontend/` para comportamento observavel de telas e componentes
  integrados.
- `tests/e2e/` para jornadas completas navegador + API + banco.
- Specs devem conter orquestracao, nao logica de implementacao.

## Seletores de frontend

`data-testid` existente e contrato de automacao. E estritamente proibido
remover, renomear ou trocar um `data-testid` ja usado por pages, specs,
unitarios ou fluxos E2E.

Regras obrigatorias:

- se uma automacao falhar porque um `data-testid` foi removido no frontend,
  registre o problema e restaure o seletor na tela
- nao altere page objects ou specs para contornar remocao de `data-testid` com
  seletor textual, CSS ou XPath
- se um novo seletor for necessario, solicite/adiciona um novo `data-testid`
  mantendo o antigo
- mudanca de `data-testid` so pode acontecer com pedido explicito e migracao
  coordenada dos testes afetados

Prioridade obrigatoria:

1. `data-testid`
2. `getByRole`
3. `getByLabel`
4. `getByPlaceholder`
5. `getByText`
6. CSS
7. XPath somente como ultimo recurso

No Meveum, sempre preferir `data-testid` quando houver como definir ou usar.
Se a tela ainda nao tiver `data-testid`, adicionar no frontend antes de escrever
uma automacao fragil.

Formato sugerido:

```text
[contexto]-[elemento]-[descricao]
```

Exemplos:

- `login-input-email`
- `login-input-senha`
- `login-button-entrar`
- `dashboard-card-pedidos-abertos`

## Padrao de implementacao

- Nao usar `waitForTimeout`.
- Esperar por estado observavel da pagina ou resposta controlada.
- Nao deixar locators soltos dentro das specs.
- Nao deixar mocks, payloads complexos ou validacoes extensas dentro da spec.
- Nao declarar `const`, montar payloads ou preparar massa dentro de spec.
- Dados, tokens, respostas e cenarios devem chegar prontos via fixtures.
- A unica logica aceita dentro da spec e `for` quando a iteracao for util.
- Em iteracoes, usar `test.step()` para manter relatorios legiveis.
- Specs devem delegar verificacoes para pages/services quando fizer sentido.
- Evitar validar texto literal de erro, salvo quando o requisito exigir a
  frase exata; preferir validar estado, codigo, comportamento ou sinal visual.

## Convencoes de teste

- Testes escritos em portugues brasileiro.
- Nomes tecnicos e APIs continuam em ingles quando forem da stack.
- Toda spec deve usar tags no segundo argumento do `test`, no formato
  `{ tag: ['@tag'] }`.
- Nao embutir tags no texto do titulo do teste.
- Tags obrigatorias, conforme o escopo:
  - `@api`
  - `@frontend`
  - `@e2e`
  - `@contrato`
  - `@smoke`
  - `@regressao`
  - `@negativo`
- Parametrizacoes devem ser objetivas e legiveis.

## Dados de teste

- Massas previsiveis ficam em `data/`.
- Evitar valores aleatorios sem necessidade.
- Quando houver autenticacao, preferir factories ou builders de payload nos
  services/data em vez de duplicar JSON em specs.
- Presets frequentes devem ficar padronizados nas fixtures:
  - `usuarioLogado`
  - `segundoUsuarioLogado`
  - `sessaoUsuarioLogadoNoBrowser`
  - `sessaoSegundoUsuarioNoBrowser`
  - `catalogoCompleto`
  - `clienteComEndereco`
  - `pedidoPickup`
  - `pedidoDelivery`
  - `dashboardComMovimento`
- Estados autenticados nunca devem depender de conta hardcoded no banco.
- Quando um teste precisar de conta, ele deve registrar usuario novo, logar e
  entao seguir o fluxo.

## Validacao de banco em E2E

- Fluxos E2E devem conferir persistencia no PostgreSQL quando criarem ou
  alterarem registros.
- O acesso ao banco fica isolado em service proprio, nunca em specs.
- Specs nao montam SQL, nao normalizam dados e nao calculam expectativas.
- Validacoes de banco devem focar estado de dominio:
  - usuario e loja criados
  - token de recuperacao gerado/usado
  - produto criado, atualizado, indisponibilizado ou removido logicamente
  - cliente, endereco, pedido e itens persistidos
  - status de pedido alterado
  - dados operacionais da loja persistidos

## Limites atuais

- Nao criar testes esteticos, de tamanho, cor ou layout fino.
- Nao mascarar falhas com `test.skip`, `test.fail` ou condicionais de bypass.
- Nao misturar responsabilidades em E2E quando API/frontend ja cobrirem o
  comportamento com mais clareza.
- Nao gerar matriz cartesiana burra: cobrir caminhos por composicao.

## Roadmap

### E2E atual - 2026-05-14

Objetivo: criar a primeira suite E2E real em `tests/e2e/`, cobrindo jornadas
criticas de ponta a ponta com persistencia conferida no PostgreSQL.

Mapa inteligente de cenarios:

- Auth/onboarding:
  - [x] Cadastro via UI cria usuario, loja, sessao e dashboard.
  - [x] Logout e login reusam a conta criada no mesmo fluxo.
  - Cobertura combinada: cadastro -> banco -> dashboard -> logout -> login.
- Recuperacao de senha:
  - [x] Usuario existente solicita recuperacao via UI.
  - [x] Token existe no banco e depois fica marcado como usado.
  - [x] Login com nova senha funciona.
  - Cobertura combinada: forgot -> banco -> reset -> banco -> login.
- Cardapio administrativo e publico:
  - [x] Produto criado no painel persiste no banco.
  - [x] Produto aparece no cardapio publico da loja.
  - [x] Toggle de disponibilidade altera `products.available`.
  - [x] Exclusao remove logicamente via `products.active`.
  - Cobertura combinada: categoria por preset -> produto UI -> banco ->
        publico -> toggle -> banco -> exclusao -> banco.
- Pedido publico pickup:
  - [x] Cliente adiciona item no cardapio publico.
  - [x] Checkout retirada cria cliente, pedido e itens.
  - [x] Pedido aparece no painel administrativo e pode avancar status.
  - Cobertura combinada: publico pickup -> banco -> painel pedidos ->
        status -> banco.
- Pedido publico delivery:
  - [x] Cliente adiciona item no cardapio publico.
  - [x] Checkout delivery cria cliente, endereco, pedido, itens e taxa.
  - [x] Dashboard, clientes e busca refletem o movimento.
  - Cobertura combinada: publico delivery -> banco -> dashboard ->
        clientes.
- Configuracoes:
  - [x] Dados basicos da loja editados no painel persistem em `stores`.
  - [x] Pausa manual altera estado operacional.
  - [x] Horario alterado persiste.
  - [x] Taxa criada/removida persiste em areas de entrega.
  - Cobertura combinada: dados -> banco -> status -> banco -> horario ->
        banco -> taxa -> banco.

Roadmap de execucao:

- [x] Atualizar Playwright para projeto `e2e`.
- [x] Adicionar dependencia `pg` e service de banco.
- [x] Criar fixture E2E com DB service e massas prontas.
- [x] Completar page objects necessarios sem logica nas specs.
- [x] Implementar specs E2E nos fluxos acima.
- [x] Rodar E2E isolado.
- [x] Rodar automacoes completas.
- [x] Registrar resultado e abrir PR.

Resultado da rodada:

- `npm.cmd test -- --project=e2e`: 6 testes passando.
- `npm.cmd test`: 71 testes Playwright passando.
- E2E encontrou e a rodada corrigiu dois bugs de frontend:
  - toggle de disponibilidade agora usa `PATCH /produtos/{id}/toggle-disponivel`
    e valida `products.available`;
  - checkout publico nao desmonta a tela de sucesso ao limpar o carrinho.

### Revisao atual - 2026-05-14

Use este bloco para retomar a revisao completa das automacoes. O escopo desta
rodada original permitia alterar `automations/` e `api/`. Rodadas E2E
posteriores tambem podem alterar `web/` quando for necessario adicionar
`data-testid` ou corrigir bug real exposto por jornada ponta a ponta.

- [x] Inventariar projetos, fixtures, presets, services, pages e specs.
- [x] Verificar se todas as specs usam fixtures locais e tags no segundo
      argumento do `test`.
- [x] Remover logica, payloads e constantes indevidas de specs, mantendo apenas
      orquestracao e `for` com `test.step()` quando necessario.
- [x] Conferir presets de usuario autenticado, segundo usuario, catalogo,
      clientes, pedidos e dashboard.
- [x] Cobrir novas features de autenticacao nos testes de API, ignorando OAuth
      social por enquanto.
- [x] Verificar se existe automacao para todos os fluxos atuais e previstos da
      aplicacao sem criar E2E completo.
- [x] Abrir issues para lacunas que dependem de frontend ou comportamento ainda
      nao implementado.
- [x] Rodar automacoes relevantes localmente e registrar resultado.
      - `npm.cmd test -- --project=rest`: 41 testes passando.
      - `npm.cmd test -- --project=chrome`: 24 testes passando, com falhas
        esperadas vinculadas a `#26` e `#27`.
      - `npm.cmd test`: 65 testes passando.
- [x] Revisar CI/CD e decidir se deve rodar suite completa ou apenas smoke.
      - Manter suite completa no workflow de automacoes. O tempo local ficou
        baixo e o ganho de contrato compensa mais do que rodar apenas smoke.

### Fase 1 - Fundacao das automacoes

- [x] Criar estrutura inicial de `pages`, `services`, `fixtures`, `tests` e
      `data`.
- [x] Definir configuracao base do Playwright para frontend e API.
- [x] Criar convencoes de `data-testid` que serao exigidas no frontend.
- [x] Mapear gaps atuais de testabilidade na interface.

### Fase 2 - Integracoes de backend prioritarias

- [x] Cobrir autenticacao:
  - cadastro
  - login
  - perfil autenticado
  - respostas nao autorizadas
- [x] Cobrir cardapio publico e disponibilidade de dados base.
- [x] Cobrir criacao e consulta de pedidos.
- [x] Cobrir dashboards e resumos retornados pela API, quando aplicavel.

### Fase 3 - Integracoes de frontend prioritarias

- [x] Cobrir tela de autenticacao com `data-testid`.
- [x] Cobrir persistencia de sessao/token no browser.
- [x] Cobrir carregamento do painel autenticado com identidade real do usuario.
- [x] Cobrir navegacao e exibicao de dados publicos do cardapio.
- [x] Cobrir telas administrativas que ainda podem expor lacunas de integracao
      ou dependencia de mocks.

### Fase 4 - Evolucao guiada pela piramide

- [x] Identificar comportamentos que ainda devem nascer como testes unitarios
      no proprio `api/` e `web/`.
- [x] Criar automacoes apenas para cenarios onde a integracao agrega sinal real.
- [x] Revisar redundancias entre testes unitarios e automacoes.
- [x] Cobrir isolamento entre usuarios/lojas com segundo usuario autenticado.

### Fase 5 - E2E futuro

- [ ] Planejar jornadas completas apenas depois da base de integracao estar
      confiavel.
- [ ] Priorizar poucos fluxos criticos e de alto valor.

## Ordem recomendada para execucao

1. Fundacao da pasta de automacoes.
2. API de autenticacao.
3. Frontend de autenticacao e sessao.
4. API de pedidos e cardapio.
5. Frontend conectado aos fluxos que ja deixaram de ser mockados.
6. Revisao da piramide e eliminacao de redundancias.
7. Somente depois, E2E.

## Proximo foco

- Acompanhar as issues de frontend abertas para lacunas de tela/contrato.
- Quando `#26` e `#27` forem corrigidas, remover os `test.fail` dos specs de
  autenticacao.
- Evoluir cobertura conforme novas telas administrativas forem implementadas,
  ainda sem criar E2E completo.

## Bugs atualmente cobertos por issues

- `#26` cadastro valido ainda depende de aceite de termos sem `data-testid`
  estavel; o teste esta marcado como falha esperada.
- `#27` validacoes obrigatorias do cadastro nao expõem todos os erros com
  seletores estaveis; o teste esta marcado como falha esperada.
- `#54` cardapio administrativo precisa gerenciar categorias e complementos.
- `#55` configuracoes precisa CRUD real de areas de entrega e pagamentos.
- `#56` clientes precisa CRUD, enderecos e estatisticas reais.
- `#57` dashboard precisa consumir agregados reais da API.
- `#58` cardapio publico quebra quando produto usa imagem externa em host nao
  configurado no Next.

## Regras de manutencao

- Se a automacao revelar necessidade de `data-testid`, ajustar o frontend.
- Se a automacao revelar comportamento isolado que deveria estar em unitario,
  priorizar o teste unitario em vez de crescer a camada de integracao.
- Cada nova familia de testes deve vir acompanhada de estrutura clara e
  manutencao simples.
