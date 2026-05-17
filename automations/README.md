# MeVeUm Automations

Automacoes Playwright do MeVeUm. Este modulo cobre contratos de API,
comportamento observavel no frontend e jornadas E2E criticas com validacao de
banco quando ha escrita de dados.

## Stack

| Tecnologia | Uso |
|---|---|
| Playwright 1.60+ | Browser, APIRequestContext, traces e relatorios |
| JavaScript ESM | Specs, pages, fixtures e services |
| `pg` | Validacao direta no PostgreSQL em fluxos E2E |

## Metricas atuais

Estado da suite nesta revisao:

| Camada | Specs | Testes | Objetivo |
|---|---:|---:|---|
| API | 12 | 41 | Contratos HTTP, CRUD, negativos e isolamento |
| Frontend | 9 | 23 | Comportamento observavel no browser |
| E2E | 4 | 6 | Jornada completa browser + API + banco |
| Total | 25 | 70 | Suite completa |

Ao adicionar ou remover cenarios relevantes, atualize esta tabela.

## Como rodar

Com API e web ja rodando:

```bash
npm ci
npx playwright install chromium
npm test
```

Por camada:

```bash
npm run test:api
npm run test:frontend
npm run test:e2e
```

Por tag:

```bash
npm run test:smoke
npm run test:regressao
npm run test:negativo
npm run test:contrato
```

Abrir o relatorio local:

```bash
npm run report
```

## URLs e variaveis

`playwright.config.js` usa:

| Variavel | Default | Uso |
|---|---|---|
| `WEB_BASE_URL` | `http://localhost:3000` | Projetos `chrome` e `e2e` |
| `API_BASE_URL` | `http://127.0.0.1:8080` | Projeto `rest` |
| `PGHOST` ou `DB_HOST` | `127.0.0.1` | PostgreSQL |
| `PGPORT` ou `DB_PORT` | `5432` | PostgreSQL |
| `PGDATABASE` ou `DB_NAME` | `meveum` | PostgreSQL |
| `PGUSER` ou `DB_USER` | `meveum` | PostgreSQL |
| `PGPASSWORD` ou `DB_PASSWORD` | `meveum` | PostgreSQL |
| `DB_ASSERT_TIMEOUT` | `10000` | Retry das validacoes de banco |

## Projetos Playwright

| Projeto | `testMatch` | O que cobre |
|---|---|---|
| `rest` | `tests/api/**/*.spec.js` | API via `request` |
| `chrome` | `tests/frontend/**/*.spec.js` | Browser em Desktop Chrome |
| `e2e` | `tests/e2e/**/*.spec.js` | Browser + API + banco |

Configuracao padrao:

- `fullyParallel: true`;
- `retries: 2`;
- `workers: 1` no CI;
- `trace: on`;
- `screenshot: on`;
- `video: on-first-retry`;
- timeout de teste: 120s;
- timeout de expect: 10s.

## Estrutura

```text
automations/
|-- tests/
|   |-- api/        Specs de contrato e integracao HTTP
|   |-- frontend/   Specs de comportamento no browser
|   `-- e2e/        Jornadas criticas completas
|-- pages/          Page Objects: DOM e interacoes
|-- services/       HTTP, banco e fluxos reutilizaveis
|-- fixtures/       Injecao de pages, services e presets
|-- presets/        Estados prontos de teste via API/fluxos reais
|-- data/           Builders e massa previsivel
`-- playwright.config.js
```

## Padrao de responsabilidade

| Pasta | Pode fazer | Nao pode fazer |
|---|---|---|
| `tests/` | Orquestrar cenario e chamar fixtures/pages/services | Montar payload complexo, SQL, DOM solto |
| `pages/` | Clicar, preencher, navegar, validar DOM | Chamar API, banco ou montar regra de negocio |
| `services/` | Chamar API, banco, preparar massa, validar contratos | Acessar DOM |
| `fixtures/` | Instanciar dependencias e controlar setup/teardown | Ter assercao de negocio grande |
| `presets/` | Criar estado reutilizavel por fluxo real | Depender de seed fixa quando precisa isolamento |
| `data/` | Builders de payload e valores previsiveis | Chamadas HTTP ou SQL |

## Metodos padrao

### Page Objects

Use nomes orientados a comportamento:

```js
async abrir() {}
async validarLista() {}
async abrirCriacao() {}
async salvar(payload) {}
async buscar(termo) {}
```

Regras:

- locators ficam no constructor;
- specs nao usam `page.getBy...` diretamente;
- validacoes de tela ficam em metodos `validar*`;
- acoes ficam em metodos verbais;
- nao usar `waitForTimeout`.

### Services de API

Services encapsulam endpoints e retornam response/body pronto:

```js
async criarProduto(payload) {}
async listarProdutos(params) {}
async detalharProduto(id) {}
```

Use helpers de `contract.service.js`:

- `esperarStatus`
- `esperarStatusEJson`
- `esperarCampos`
- `esperarCamposPresentes`
- `esperarListaComItem`
- `esperarListaNaoVazia`
- `esperarErro`

### DatabaseService

Toda validacao direta de banco fica em `services/database.service.js`.

Padrao atual:

- `validarComRetry` usa `expect(...).toPass`;
- intervalos: `100ms`, `250ms`, `500ms`, `1000ms`;
- timeout configuravel por `DB_ASSERT_TIMEOUT`;
- consultas usam `buscarUm` e `buscarTodos`;
- specs nunca escrevem SQL direto.

Use retry quando a validacao depende de escrita assincrona ou de propagacao
entre UI, API e banco.

## Tags obrigatorias

Toda spec deve declarar tags no segundo argumento do `test`:

```js
test('cria pedido pickup', { tag: ['@e2e', '@smoke', '@regressao'] }, async ({}) => {})
```

Tags usadas:

| Tag | Uso |
|---|---|
| `@api` | Contrato/integracao HTTP |
| `@frontend` | Browser sem validacao direta de banco |
| `@e2e` | Jornada completa |
| `@smoke` | Sinal principal de saude |
| `@regressao` | Cobertura de comportamento existente |
| `@contrato` | Contrato HTTP ou DOM/fluxo estavel |
| `@negativo` | Erro, bloqueio ou validacao |

## Estrategia de cenarios

Evite explosao combinatoria. Cubra cada variacao no nivel mais barato.

Exemplo:

- API cobre combinacoes de payload, validacao e status HTTP.
- Frontend cobre renderizacao, navegacao e validacao visivel.
- E2E cobre poucos caminhos que provam a integracao ponta a ponta.

Se uma pagina tem cenarios A, B e C, nao gere todas as permutacoes por reflexo.
Monte caminhos que exercitem os comportamentos sem duplicar o que a camada de
baixo ja provou.

## Validacao de banco

Fluxos E2E que criam ou alteram dados devem validar persistencia:

- usuario e loja criados;
- token de recuperacao gerado/usado;
- produto criado, indisponibilizado ou removido;
- cliente e endereco persistidos;
- pedido, itens e status persistidos;
- dados de configuracao da loja persistidos.

SQL pertence a `DatabaseService`. Specs chamam metodos de dominio, por exemplo:

```js
await databaseService.validarPedidoCriado({ lojaId, checkout, tipo, produtoId });
```

## Seletores e contrato visual

`data-testid` e contrato entre frontend e automacao. Nao renomeie nem remova sem
migracao coordenada.

Tambem nao e permitido validar elemento invisivel apenas para manter teste
verde. Se o usuario nao enxerga ou nao consegue usar o elemento, ele nao faz
parte do contrato ativo. Documente a pendencia e reative quando o elemento
voltar visivel.

## Relatorios e artefatos

Localmente, Playwright gera:

- `playwright-report/`
- `test-results/`
- traces, screenshots e videos quando configurado.

Esses arquivos nao devem ser commitados.

No GitHub Actions:

- `playwright-report` e publicado sempre;
- `playwright-test-results` e publicado em falha;
- logs da API e web sao publicados em falha.

## Checklist antes de PR

- Specs usam fixtures locais.
- Specs nao contem SQL, DOM solto ou payload grande.
- Page Objects centralizam locators.
- Services centralizam API/banco.
- E2E valida banco quando escreve dado.
- Tags estao no formato `{ tag: [...] }`.
- Nao ha `test.skip`, `test.fail` ou bypass silencioso.
- Nao ha `waitForTimeout`.
- Nao ha dependencia de conta hardcoded para novos cenarios.
