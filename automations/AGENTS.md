# AGENTS.md - Automacoes Meveum

## Objetivo

Esta pasta concentra a estrategia e a implementacao das automacoes do Meveum.
O foco atual e cobrir integracoes de backend e frontend com boa manutencao,
sem iniciar jornadas E2E completas por enquanto.

## Direcao geral

- Respeitar a piramide de testes.
- Preferir teste unitario quando ele cobrir o comportamento com clareza.
- Criar automacao de integracao quando for preciso validar contratos,
  composicao entre camadas ou comportamento observavel no browser.
- Nao criar E2E agora.
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
- Specs devem conter orquestracao, nao logica de implementacao.

## Seletores de frontend

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

## Limites atuais

- Nao implementar E2E ainda.
- Nao automatizar fluxos inteiros de ponta a ponta entre telas e backend.
- Nao misturar responsabilidades de frontend e backend no mesmo teste se o
  objetivo puder ser coberto por integracoes menores.

## Roadmap

### Revisao atual - 2026-05-14

Use este bloco para retomar a revisao completa das automacoes. O escopo desta
rodada permite alterar `automations/` e `api/`, mas nao alterar `web/`.

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
