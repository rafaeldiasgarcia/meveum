# MeVeUm Web

Frontend Next.js do MeVeUm. Este modulo entrega a landing page, fluxos de
autenticacao, painel administrativo do lojista e cardapio publico por slug.

## Stack

| Tecnologia | Uso |
|---|---|
| Next.js 16.2.6 | App Router, build e server |
| React 19.2.4 | UI |
| TypeScript 5 | Tipagem |
| Tailwind CSS 4 | Estilizacao |
| Radix UI | Componentes acessiveis |
| React Hook Form + Zod | Formularios e validacao |
| Lucide React | Icones |
| Sonner | Toasts |
| Vitest + Testing Library | Testes unitarios/comportamentais |

## Como rodar

```bash
npm ci
cp .env.local.example .env.local
npm run dev
```

No Windows PowerShell:

```powershell
npm ci
Copy-Item .env.local.example .env.local
npm run dev
```

URL local:

- `http://localhost:3000`

Variavel principal:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Sobe o Next em desenvolvimento |
| `npm run build` | Valida TypeScript e gera build de producao |
| `npm run start` | Sobe a build produzida |
| `npm test` | Roda Vitest uma vez |
| `npm run test:watch` | Roda Vitest em watch |
| `npm run lint` | Roda ESLint |

## Rotas

| Rota | Descricao |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Cadastro |
| `/esqueci-senha` | Solicitacao de recuperacao |
| `/redefinir-senha` | Redefinicao de senha |
| `/dashboard` | Resumo operacional |
| `/dashboard/cardapio` | Produtos do cardapio |
| `/dashboard/cardapio/categorias` | Categorias |
| `/dashboard/cardapio/complementos` | Complementos |
| `/dashboard/clientes` | CRM |
| `/dashboard/configuracoes` | Dados da loja, horarios e entrega |
| `/dashboard/configuracoes/pagamentos` | Formas de pagamento |
| `/dashboard/pedidos` | Pedidos |
| `/[slug]` | Cardapio publico da loja |
| `/termos-de-uso` | Termos |
| `/politica-de-privacidade` | Politica |

## Estrutura

```text
src/
|-- app/                         Rotas App Router
|   |-- (auth)/                  Login, cadastro e recuperacao
|   |-- (dashboard)/dashboard/   Painel administrativo
|   |-- [slug]/                  Cardapio publico
|   `-- page.tsx                 Landing
|-- components/
|   |-- layout/                  Sidebar e Topbar
|   |-- shared/                  Componentes reutilizaveis do produto
|   `-- ui/                      Primitivos de UI
|-- features/
|   |-- auth/                    Sessao autenticada e carousel
|   |-- cardapio-publico/        Carrinho, vitrine e checkout publico
|   `-- dashboard/               Componentes do dashboard
|-- lib/
|   |-- api/                     Clients por dominio
|   |-- utils/                   Helpers puros
|   `-- validations/             Schemas Zod
|-- tests/                       Testes Vitest
`-- types/                       Tipos compartilhados
```

## Cliente HTTP

Arquivo base: `src/lib/api/client.ts`.

Responsabilidades:

- resolver `BASE_URL` via `NEXT_PUBLIC_API_URL`;
- padronizar `Content-Type`;
- extrair mensagens de erro da API;
- persistir/remover sessao em `localStorage`;
- anexar `Authorization: Bearer <token>` em chamadas autenticadas;
- resolver `lojaId` a partir do usuario salvo.

Services por dominio ficam em `src/lib/api/*.api.ts`:

| Arquivo | Dominio |
|---|---|
| `auth.api.ts` | Login, cadastro, recuperacao e usuario atual |
| `cardapio.api.ts` | Produtos e categorias administrativas |
| `cardapio-publico.api.ts` | Loja publica e produtos por slug |
| `clientes.api.ts` | Clientes e enderecos |
| `complementos.api.ts` | Grupos/opcoes de complemento |
| `configuracoes.api.ts` | Loja, horarios e areas de entrega |
| `dashboard.api.ts` | Resumo, grafico, KDS e rankings |
| `pagamentos.api.ts` | Formas de pagamento |
| `pedidos.api.ts` | Listagem, detalhe e status |

Regra: componente/page nao deve chamar `fetch` direto. Chamada HTTP passa por
service de `lib/api`.

## Estado de sessao

Chaves usadas no browser:

| Chave | Conteudo |
|---|---|
| `meveum_token` | JWT retornado pelo login/cadastro |
| `meveum_usuario` | Usuario autenticado serializado |

`SessaoAutenticadaContext` centraliza restauracao da sessao, logout e protecao
do dashboard.

## Formularios e validacao

Schemas Zod ficam em `src/lib/validations`.

Padrao esperado:

- schema separado por dominio;
- mensagem de erro por campo;
- `data-testid` em input, botao, form e erro relevante;
- estado de loading/submitting;
- feedback de sucesso/erro;
- teste cobrindo validacao comportamental.

## Componentes e layout

Padrao de UI:

- componentes de `components/ui` sao pequenos e reutilizaveis;
- componentes de `components/shared` carregam semantica do produto;
- `features/*/components` contem UI especifica de uma jornada;
- pages montam a tela, mas nao devem concentrar regra complexa.

Evite teste estetico. Testes devem validar comportamento observavel: item
aparece, botao chama acao, formulario bloqueia dado invalido, estado vazio
renderiza, navegacao ocorre.

## `data-testid`

`data-testid` e contrato publico com automacoes e testes. Nao renomeie nem
remova sem migracao coordenada.

Tambem e proibido manter `data-testid` em elemento invisivel ou fora da jornada
real apenas para a automacao passar. Se a funcionalidade ainda nao esta pronta:

1. remova o elemento do contrato ativo;
2. deixe TODO/issue descrevendo o contrato futuro;
3. reative o `data-testid` quando o elemento voltar visivel e utilizavel.

## Testes

```bash
npm test
```

Estado atual:

- Vitest com ambiente `jsdom`;
- setup em `src/tests/setup.ts`;
- aliases `@/*` configurados no `vitest.config.ts`;
- testes de componentes compartilhados, schemas e clients de API.

Para mudancas de UI:

- rode `npm test`;
- rode `npm run build` quando tocar rota, tipo, schema, client ou config;
- rode Playwright afetado em `automations/` se mudar comportamento usado por
  usuario.

## Build

```bash
npm run build
npm run start
```

No CI, o job `Web - testes e build` executa:

1. `npm ci`
2. `npm test`
3. `npm run build`

## Checklist antes de PR

- API client atualizado se o endpoint mudou.
- Tipo em `src/types` alinhado ao DTO da API.
- Formulario com schema e mensagens.
- Estado loading/erro/vazio quando aplicavel.
- `data-testid` apenas em elemento real da jornada.
- Teste unitario/comportamental atualizado.
- Build local passando quando houver mudanca estrutural.
