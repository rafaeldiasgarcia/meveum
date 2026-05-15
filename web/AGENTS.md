# AGENTS.md - Padroes do frontend Meveum

Este arquivo define os padroes que devem ser seguidos no frontend do Meveum.
Antes de implementar qualquer funcionalidade, leia e respeite estas regras.

O frontend deve ser construido para funcionar de forma independente durante o desenvolvimento, com endpoints mockados, funcionalidades navegaveis e testes unitarios cobrindo comportamento, regras de interface e integracoes simuladas.

## Objetivo do frontend

O frontend do Meveum deve entregar uma experiencia simples, direta e pronta para futura integracao com o backend.

A implementacao deve priorizar:

- telas funcionais
- fluxos completos de usuario
- componentes reutilizaveis
- chamadas de API centralizadas e mockadas
- testes unitarios de comportamento
- atributos `data-testid` consistentes
- separacao clara de responsabilidades
- facilidade para conectar com o backend real depois

Nao implemente apenas layout estatico. Cada tela deve ter comportamento esperado, estados de loading, erro, vazio e sucesso quando fizer sentido.

## Arquitetura geral

O frontend deve seguir uma organizacao modular por dominios, parecida com a divisao do backend.

Estrutura sugerida:

```text
src/
├── app/                    ← configuracoes globais, providers e rotas
├── shared/                 ← codigo compartilhado
├── features/               ← dominios do produto
│   ├── auth/               ← login, cadastro e sessao
│   ├── cardapio/           ← gestao de cardapio
│   ├── pedidos/            ← gestao de pedidos
│   ├── pagamentos/         ← pagamentos
│   ├── entrega/            ← entregas
│   ├── crm/                ← clientes
│   ├── dashboard/          ← analytics e metricas
│   └── integracao-whatsapp/← integracao com WhatsApp
└── test/                   ← configuracoes e utilitarios de teste
```

Cada dominio deve concentrar seus proprios arquivos:

```text
features/cardapio/
├── components/
├── pages/
├── services/
├── hooks/
├── types/
├── mocks/
├── utils/
└── __tests__/
```

Evite criar arquivos soltos em `src/` sem necessidade.

## Camadas do frontend

Cada responsabilidade deve ficar em sua camada correta.

### Pages

Pages representam telas completas.

Devem:

- montar a estrutura principal da tela
- chamar hooks ou services necessarios
- organizar sections e componentes
- controlar estados de tela quando fizer sentido

Nao devem conter:

- regras complexas de negocio
- chamadas HTTP diretas espalhadas
- dados mockados inline
- funcoes grandes de transformacao
- componentes gigantes dentro do mesmo arquivo

### Components

Components devem ser reutilizaveis e focados em UI funcional.

Devem receber dados por props e emitir eventos por callbacks.

Evite componentes que:

- acessam API diretamente sem necessidade
- misturam muitas responsabilidades
- dependem de dados globais sem motivo
- possuem logica grande demais dentro do JSX/TSX

Componentes grandes devem ser quebrados em componentes menores.

### Services

Services centralizam a comunicacao com APIs.

Mesmo que os endpoints estejam mockados, toda chamada deve passar por services.

Exemplo esperado:

```ts
export async function listarProdutos(): Promise<ListarProdutoResponse[]> {
  return api.get("/produtos");
}
```

Nao chame `fetch`, `axios` ou mocks diretamente em pages/components.

### Hooks

Hooks devem concentrar logicas reutilizaveis de tela.

Use hooks para:

- buscar dados
- controlar estados de formulario
- encapsular regras de interface
- coordenar services com componentes

Exemplo:

```ts
export function useProdutos() {
  const [produtos, setProdutos] = useState<ListarProdutoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregarProdutos() {
    setLoading(true);
    setError(null);

    try {
      const response = await listarProdutos();
      setProdutos(response);
    } catch {
      setError("Nao foi possivel carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  return { produtos, loading, error, carregarProdutos };
}
```

## Endpoints mockados

Enquanto o backend nao estiver integrado, os endpoints devem permanecer mockados.

Regra obrigatoria:

- nao espalhe mocks dentro de componentes
- nao coloque arrays mockados diretamente em pages
- centralize mocks por dominio
- mantenha os contratos parecidos com os DTOs do backend
- simule respostas de sucesso, erro e lista vazia quando fizer sentido

Estrutura sugerida:

```text
features/cardapio/
├── services/
│   └── produtoService.ts
├── mocks/
│   ├── produtoMock.ts
│   └── produtoHandlers.ts
└── types/
    └── produtoTypes.ts
```

Os services devem apontar para uma camada de API que possa ser trocada depois.

Exemplo:

```ts
export const endpoints = {
  produtos: "/produtos",
  categorias: "/categorias",
  pedidos: "/pedidos",
};
```

Quando o backend real estiver pronto, a troca deve acontecer preferencialmente na camada de API/services, sem refatorar pages e components.

## Contratos e tipos

Use tipos especificos por funcionalidade, seguindo a ideia dos DTOs do backend.

Nao reutilize tipo apenas porque os campos sao parecidos hoje.

Padrao de nomes:

- `CriarProdutoRequest`
- `CriarProdutoResponse`
- `ListarProdutoResponse`
- `DetalharProdutoResponse`
- `AtualizarProdutoRequest`
- `AtualizarProdutoResponse`

Exemplo:

```ts
export type CriarProdutoRequest = {
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId: string;
};

export type CriarProdutoResponse = {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
};
```

Evite usar `any`. Quando ainda nao souber o contrato final, crie um tipo temporario claro e facil de substituir.

## Formularios

Formularios devem ter validacao clara e mensagens compreensiveis.

Obrigatorio em formularios:

- labels associados aos campos
- mensagens de erro por campo
- estado de envio
- feedback de sucesso ou erro
- botao desabilitado quando a acao nao puder ser executada
- `data-testid` nos campos, botoes e mensagens importantes

Nao valide apenas visualmente. A validacao precisa estar testavel.

## Estados obrigatorios de tela

Sempre que uma tela depender de dados, implemente os estados quando fizer sentido:

- loading
- erro
- vazio
- sucesso

Exemplo de nomes de `data-testid`:

```text
produtos-loading
produtos-error
produtos-empty-state
produtos-list
produto-card-{id}
```

## data-testid

Todo elemento interativo ou container essencial para a jornada do usuario deve possuir `data-testid`.

### Proibicao estrita de alterar seletores

`data-testid` existente e contrato publico entre frontend, testes unitarios,
automacoes Playwright e revisoes futuras. E estritamente proibido remover,
renomear ou trocar o valor de um `data-testid` ja existente.

Regras obrigatorias:

- nunca remova `data-testid` existente em refactor, redesign ou troca de
  componente
- nunca renomeie `data-testid` para "melhorar padrao" sem alinhamento explicito
  e atualizacao coordenada dos testes
- se um elemento mudar de lugar ou componente, carregue o mesmo `data-testid`
  junto com ele
- se um novo seletor for necessario, adicione um novo `data-testid` mantendo o
  antigo ate haver migracao planejada dos testes
- se uma automacao quebrar porque um `data-testid` sumiu, a correcao padrao e
  restaurar o `data-testid` no frontend, nao alterar o teste para um seletor
  mais fragil

Alterar `data-testid` sem pedido explicito do responsavel do fluxo e bloqueio
de PR.

Use `data-testid` em:

- botoes
- links importantes
- inputs
- selects
- checkboxes
- radios
- formularios
- mensagens de erro
- mensagens de sucesso
- cards principais
- listas
- modais
- menus
- abas
- containers de estado vazio/loading/erro

Nao e necessario usar `data-testid` em elementos puramente decorativos.

Padrao de nome:

```text
<contexto>-<elemento>-<acao-ou-estado>
```

Exemplos:

```text
login-form
login-email-input
login-password-input
login-submit-button
login-error-message

produto-card-123
produto-criar-button
produto-nome-input
produto-preco-input
produto-salvar-button
produto-excluir-button

pedido-status-select
pedido-atualizar-status-button
pedido-empty-state
```

Regras:

- use nomes em kebab-case
- seja especifico e previsivel
- nao use nomes genericos como `button`, `input` ou `card`
- quando houver lista, inclua identificador no item quando possivel
- mantenha os nomes estaveis para nao quebrar testes sem necessidade

## Testes unitarios

Toda funcionalidade implementada deve possuir testes unitarios.

Os testes devem validar comportamento, nao estetica.

Testes devem cobrir:

- renderizacao dos dados principais
- interacoes do usuario
- validacoes de formulario
- chamada de callbacks
- estados de loading, erro e vazio
- comportamento de hooks/services quando aplicavel
- navegacao ou mudanca de estado quando fizer sentido

Nao faca testes esteticos.

Proibido testar:

- cor
- fonte
- tamanho de fonte
- espacamento
- borda
- sombra
- animacao visual
- posicao exata de elementos
- snapshots gigantes focados em markup visual

Permitido testar:

- se o botao existe
- se o botao fica desabilitado por uma regra
- se uma mensagem aparece apos uma acao
- se um item e renderizado com os dados corretos
- se uma funcao foi chamada com os parametros corretos
- se um formulario impede envio invalido

## Padrao de testes

Prefira testes orientados ao usuario.

Use queries acessiveis sempre que possivel:

```ts
screen.getByRole("button", { name: /salvar/i });
screen.getByLabelText(/nome/i);
screen.getByText(/produto criado/i);
```

Use `data-testid` quando:

- nao houver role acessivel adequada
- for um container de estado
- for necessario identificar itens dinamicos
- o elemento for essencial para a jornada e dificil de selecionar de forma acessivel

Exemplo:

```ts
expect(screen.getByTestId("produtos-empty-state")).toBeInTheDocument();
```

## Organizacao dos testes

Os testes devem ficar proximos do dominio testado.

Exemplo:

```text
features/cardapio/__tests__/
├── ProdutoCard.test.tsx
├── CriarProdutoForm.test.tsx
├── ProdutosPage.test.tsx
└── produtoService.test.ts
```

Cada teste deve ter nome claro e comportamento esperado.

Exemplo:

```ts
it("deve exibir mensagem de erro quando o nome do produto estiver vazio", async () => {
  // teste
});
```

## Mock de API nos testes

Os testes nao devem depender do backend real.

Use mocks para services, handlers ou camada de API.

Obrigatorio:

- mockar respostas de sucesso
- mockar respostas de erro quando a tela tratar erro
- mockar lista vazia quando houver empty state

Nao use dados aleatorios que mudam a cada execucao.

## Acessibilidade

A interface deve ser acessivel por padrao.

Obrigatorio:

- inputs com label
- botoes com texto ou `aria-label`
- imagens relevantes com `alt`
- modais com titulo e comportamento acessivel
- mensagens de erro compreensiveis
- estados interativos acessiveis por teclado quando possivel

Nao dependa apenas de icones sem texto ou `aria-label`.

## Padrao visual

O visual deve ser moderno, limpo e direto, mas testes nao devem validar aparencia.

Priorize:

- hierarquia clara
- boa legibilidade
- componentes consistentes
- telas objetivas
- feedback claro para o usuario
- responsividade

Evite:

- excesso de animacoes
- poluicao visual
- textos genericos
- componentes sem funcao real
- layout bonito sem comportamento

## Integração futura com backend

Mesmo com endpoints mockados, escreva o frontend como se a API real fosse integrada depois.

Obrigatorio:

- centralizar baseURL
- centralizar endpoints
- usar services por dominio
- manter tipos alinhados aos contratos esperados
- evitar dados mockados em components/pages
- tratar erros de API
- tratar estados de loading

Quando o backend real chegar, o ideal e alterar apenas:

- client HTTP
- baseURL
- handlers/mocks
- ajustes pontuais de tipos

## Nomes de arquivos

Use nomes claros e consistentes.

Exemplos:

```text
ProdutoCard.tsx
CriarProdutoForm.tsx
ProdutosPage.tsx
produtoService.ts
produtoTypes.ts
produtoMock.ts
useProdutos.ts
```

Services, hooks e utils podem usar camelCase.
Componentes e pages devem usar PascalCase.

## Regra para componentes de lista

Listas devem possuir:

- container com `data-testid`
- item com `data-testid` identificavel
- estado vazio
- feedback de loading quando carregadas por API
- mensagem de erro quando houver falha

Exemplo:

```tsx
<section data-testid="produtos-list">
  {produtos.map((produto) => (
    <ProdutoCard
      key={produto.id}
      produto={produto}
      data-testid={`produto-card-${produto.id}`}
    />
  ))}
</section>
```

## Regra para botoes e acoes

Toda acao importante deve ter feedback.

Exemplos:

- salvar produto
- excluir categoria
- atualizar status do pedido
- enviar formulario
- abrir modal
- fechar modal
- aplicar filtro

Cada acao deve ter `data-testid` proprio.

Exemplo:

```text
produto-salvar-button
produto-cancelar-button
produto-excluir-button
categoria-filtrar-button
pedido-confirmar-button
```

## Regra para modais

Modais devem possuir:

- titulo
- botao de fechar
- acao principal clara
- acao secundaria quando necessario
- `data-testid` no container
- `data-testid` nos botoes
- teste unitario para abrir e fechar

Exemplo:

```text
produto-excluir-modal
produto-excluir-confirmar-button
produto-excluir-cancelar-button
produto-excluir-modal-close-button
```

## Regra para rotas

Rotas devem ser centralizadas.

Exemplo:

```ts
export const routes = {
  login: "/login",
  cadastro: "/cadastro",
  dashboard: "/dashboard",
  cardapio: "/cardapio",
  pedidos: "/pedidos",
};
```

Nao espalhe strings de rotas pelo projeto.

## Regra para textos

Textos importantes da interface devem ser claros e orientados a acao.

Evite mensagens genericas como:

```text
Erro
Algo deu errado
Clique aqui
```

Prefira:

```text
Nao foi possivel carregar os produtos.
Criar produto
Atualizar status do pedido
```

## Regra para commits gerados por IA

Ao modificar ou criar codigo, a IA deve garantir que:

- a funcionalidade esteja completa para uso local
- os endpoints estejam mockados
- os testes unitarios tenham sido criados ou atualizados
- nenhum teste estetico tenha sido adicionado
- os principais elementos tenham `data-testid`
- nao existam dados mockados espalhados em pages/components
- a implementacao esteja pronta para integracao futura com backend

## Checklist antes de finalizar qualquer tarefa

Antes de considerar uma tarefa concluida, confira:

- a tela ou componente funciona localmente
- os dados vem de service/mock centralizado
- os tipos foram definidos corretamente
- existe estado de loading quando necessario
- existe estado de erro quando necessario
- existe estado vazio quando necessario
- elementos importantes possuem `data-testid`
- formularios possuem validacao testavel
- testes unitarios foram criados ou atualizados
- os testes nao validam estetica
- nao existem chamadas diretas de API em components/pages
- nao existem arrays mockados inline em components/pages
- a estrutura segue o dominio correto

## Regra final

Antes de criar codigo novo, confira se a implementacao respeita:

- pages sem regra complexa de negocio
- components focados em UI funcional
- services centralizando chamadas de API
- endpoints mockados por dominio
- hooks encapsulando logica reutilizavel
- types separados por funcionalidade
- `data-testid` nos elementos essenciais
- testes unitarios de comportamento
- ausencia total de testes esteticos
- codigo preparado para integracao futura com o backend
- sempre que encontrar algum erro, crie issues no github
