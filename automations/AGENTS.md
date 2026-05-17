# AGENTS.md - Automacoes Meveum

## Objetivo

Esta pasta concentra a estrategia e a implementacao das automacoes do Meveum.
O foco e cobrir contratos de API, comportamento observavel no frontend e
jornadas E2E criticas com boa manutencao.

## Direcao geral

- Respeitar a piramide de testes.
- Preferir teste unitario quando ele cobrir o comportamento com clareza.
- Criar automacao de integracao quando for preciso validar contratos,
  composicao entre camadas ou comportamento observavel no browser.
- Criar E2E apenas para jornadas criticas, sem duplicar combinacoes ja
  cobertas por testes menores.
- Manter testes pequenos, previsiveis e independentes.
- Nao criar testes esteticos, de tamanho, cor ou layout fino.
- Nao mascarar falhas com `test.skip`, `test.fail` ou condicionais de bypass.

## Fluxo de branch, commits e PR

- Trabalhe em branch separada por contexto e nao reutilize PR ja aceita.
- Separe commits por contexto real: automacao, fixture, page object, service,
  CI ou documentacao.
- Antes do push final, execute `git fetch origin main` e integre a `main`
  atualizada na branch de trabalho, resolvendo conflitos antes de subir.
- Depois de integrar a `main`, rode as automacoes relevantes novamente.
- Nao commite `.env`, dados locais, logs, relatorios temporarios,
  `playwright-report/`, `test-results/`, videos, traces ou screenshots locais.
- Se encontrar bug real, crie issue clara ou corrija o codigo dono quando o
  escopo permitir. Nao altere teste para esconder falha.

## Stack esperada

- Playwright para automacoes web e de API.
- JavaScript em ES Modules.
- `import` / `export`, nunca `require`.
- `pg` apenas em services de banco para validacoes E2E.

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

- Encapsulam chamadas HTTP, preparo de dados e integracoes controladas com
  persistencia de teste.
- Nunca acessam DOM.
- SQL e validacao direta de banco ficam em service proprio, nunca em specs.

### `fixtures/`

- Injetam pages, services e massas.
- Controlam setup e teardown do que for responsabilidade da automacao.
- Specs devem importar `test` das fixtures locais, nao direto do Playwright.

### `presets/`

- Montam estados reutilizaveis de teste a partir de fluxos reais.
- Criam dados dinamicamente via API, sem depender de seed fixo.
- Devem representar pre-condicoes recorrentes como usuario autenticado,
  segundo usuario autenticado, loja preparada, catalogo completo, cliente com
  endereco, pedido existente e dashboard com movimento.

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
  restaure o seletor na tela;
- nao altere page objects ou specs para contornar remocao de `data-testid` com
  seletor textual, CSS ou XPath;
- se um novo seletor for necessario, adicione um novo `data-testid` mantendo o
  antigo;
- mudanca de `data-testid` so pode acontecer com pedido explicito e migracao
  coordenada dos testes afetados.

Contrato de visibilidade:

- automacoes nao devem validar elementos escondidos apenas para preservar
  compatibilidade artificial;
- se o elemento nao esta visivel ou utilizavel pelo usuario, ele nao faz parte
  do contrato ativo daquela jornada;
- nao aceite `data-testid` em placeholders com `aria-hidden`, `sr-only`,
  `opacity-0`, tamanho de 1px ou padrao equivalente;
- quando uma funcionalidade ficar pendente, registre TODO ou issue apontando o
  contrato futuro e remova a assercao ativa ate o elemento voltar de forma
  visivel e testavel.

Prioridade obrigatoria de seletores:

1. `data-testid`
2. `getByRole`
3. `getByLabel`
4. `getByPlaceholder`
5. `getByText`
6. CSS
7. XPath somente como ultimo recurso

No Meveum, sempre prefira `data-testid` quando houver como definir ou usar.
Se a tela ainda nao tiver `data-testid`, ajuste o frontend antes de escrever
uma automacao fragil.

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
- Estados autenticados nunca devem depender de conta hardcoded no banco.
- Quando um teste precisar de conta, ele deve registrar usuario novo, logar e
  entao seguir o fluxo.

Presets frequentes devem ficar padronizados nas fixtures:

- `usuarioLogado`
- `segundoUsuarioLogado`
- `sessaoUsuarioLogadoNoBrowser`
- `sessaoSegundoUsuarioNoBrowser`
- `catalogoCompleto`
- `clienteComEndereco`
- `pedidoPickup`
- `pedidoDelivery`
- `dashboardComMovimento`

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

## Regras de manutencao

- Se a automacao revelar necessidade de `data-testid`, ajuste o frontend.
- Se a automacao revelar comportamento isolado que deveria estar em unitario,
  priorize o teste unitario em vez de crescer a camada de integracao.
- Cada nova familia de testes deve vir acompanhada de estrutura clara e
  manutencao simples.
- Antes de finalizar, rode a menor suite que prove a mudanca; para mudancas de
  contrato compartilhado, rode a suite completa.
