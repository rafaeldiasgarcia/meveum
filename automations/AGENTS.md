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
- Specs devem delegar verificacoes para pages/services quando fizer sentido.
- Evitar validar texto literal de erro, salvo quando o requisito exigir a
  frase exata; preferir validar estado, codigo, comportamento ou sinal visual.

## Convencoes de teste

- Testes escritos em portugues brasileiro.
- Nomes tecnicos e APIs continuam em ingles quando forem da stack.
- Toda spec deve usar tags no titulo do teste.
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

## Limites atuais

- Nao implementar E2E ainda.
- Nao automatizar fluxos inteiros de ponta a ponta entre telas e backend.
- Nao misturar responsabilidades de frontend e backend no mesmo teste se o
  objetivo puder ser coberto por integracoes menores.

## Roadmap

### Fase 1 - Fundacao das automacoes

- [ ] Criar estrutura inicial de `pages`, `services`, `fixtures`, `tests` e
      `data`.
- [x] Definir configuracao base do Playwright para frontend e API.
- [ ] Criar convencoes de `data-testid` que serao exigidas no frontend.
- [ ] Mapear gaps atuais de testabilidade na interface.

### Fase 2 - Integracoes de backend prioritarias

- [ ] Cobrir autenticacao:
  - cadastro
  - login
  - perfil autenticado
  - respostas nao autorizadas
- [ ] Cobrir cardapio publico e disponibilidade de dados base.
- [ ] Cobrir criacao e consulta de pedidos.
- [ ] Cobrir dashboards e resumos retornados pela API, quando aplicavel.

### Fase 3 - Integracoes de frontend prioritarias

- [ ] Cobrir tela de autenticacao com `data-testid`.
- [ ] Cobrir persistencia de sessao/token no browser.
- [ ] Cobrir carregamento do painel autenticado com identidade real do usuario.
- [ ] Cobrir navegacao e exibicao de dados publicos do cardapio.
- [ ] Cobrir ausencia de estados mockados que possam confundir validacoes.

### Fase 4 - Evolucao guiada pela piramide

- [ ] Identificar comportamentos que ainda devem nascer como testes unitarios
      no proprio `api/` e `web/`.
- [ ] Criar automacoes apenas para cenarios onde a integracao agrega sinal real.
- [ ] Revisar redundancias entre testes unitarios e automacoes.

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

## Regras de manutencao

- Se a automacao revelar necessidade de `data-testid`, ajustar o frontend.
- Se a automacao revelar comportamento isolado que deveria estar em unitario,
  priorizar o teste unitario em vez de crescer a camada de integracao.
- Cada nova familia de testes deve vir acompanhada de estrutura clara e
  manutencao simples.
