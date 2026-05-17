# AGENTS.md - Padroes do projeto Meveum

Este arquivo define os padroes que devem ser seguidos no backend do Meveum.
Antes de implementar qualquer funcionalidade, leia e respeite estas regras.

## Arquitetura geral

O backend segue um monolito modular organizado por dominios.

Cada dominio deve concentrar seus proprios casos de uso, DTOs, mappers,
validators, repositories e entities quando eles pertencerem ao dominio.
Codigo compartilhado entre dominios deve ficar em `shared`.

## Contratos de testabilidade

`data-testid` do frontend e contrato publico usado por automacoes e revisoes.
Mesmo em tarefas de backend que tambem toquem `web/` ou `automations/`, e
estritamente proibido remover, renomear ou trocar `data-testid` existente.

Se uma mudanca exigir novo seletor, adicione um novo `data-testid` mantendo o
antigo. Se uma automacao falhar porque um seletor foi removido, a correcao deve
restaurar o `data-testid` no frontend, nao trocar o teste para seletor fragil.

Nao preserve seletor em elemento que deixou de fazer parte da jornada real. Se
uma funcionalidade ainda nao esta pronta, e proibido manter `data-testid` em
placeholder invisivel (`aria-hidden`, `sr-only`, `opacity-0`, tamanho de 1px ou
equivalente) apenas para satisfazer testes. Documente a pendencia e reative o
contrato quando o elemento voltar visivel e utilizavel.

Estrutura base:

```text
src/main/java/br/com/meveum/
|-- cardapio/
|   |-- categorias/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- mapper/
|   |   |-- service/
|   |   `-- validator/
|   |       `-- service/
|   |-- entity/
|   `-- repository/
|-- lojas/
|   |-- entity/
|   `-- repository/
|-- pedidos/
|   |-- entity/
|   `-- repository/
|-- pagamentos/
|   |-- entity/
|   `-- repository/
|-- entrega/
|   |-- entity/
|   `-- repository/
|-- crm/
|   |-- entity/
|   `-- repository/
`-- shared/
    |-- config/
    `-- exception/
```

Nao crie pastas vazias com `.gitkeep` como promessa de arquitetura. Crie a
pasta quando houver codigo real para ela.

## Fluxo de branch, commits e PR

- Trabalhe em branch separada por contexto e nao reutilize PR ja aceita.
- Separe commits por contexto real: feature, fix, teste, docs, refactor ou CI.
- Antes do push final, execute `git fetch origin main` e integre a `main`
  atualizada na branch de trabalho, resolvendo conflitos antes de subir.
- Depois de integrar a `main`, rode os testes relevantes novamente.
- Nao commite `.env`, dados locais, logs, `target/`, `node_modules`,
  relatorios temporarios ou arquivos gerados por execucao local.
- Ao alterar contrato de API, atualize DTOs, testes unitarios e automacoes
  afetadas na mesma rodada.
- Se encontrar lacuna que pertence a outro contexto, abra issue clara em vez de
  esconder a falha ou alterar teste para passar artificialmente.

## Controllers

Controllers nao podem conter logica de negocio.

O controller deve apenas:

- receber a requisicao HTTP
- aplicar anotacoes de rota, metodo HTTP e status de resposta
- chamar o metodo correspondente da service
- devolver o response retornado pela service

Nao coloque no controller:

- validacao manual
- regra de negocio
- calculo
- acesso a repository
- conversao manual entre entity e DTO
- montagem complexa de response

Padrao obrigatorio:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public CriarProdutoResponse criar(@Valid @RequestBody CriarProdutoRequest request) {
    return criarProdutoService.criar(request);
}
```

Toda rota deve declarar:

- a anotacao do verbo HTTP: `@GetMapping`, `@PostMapping`, `@PutMapping`,
  `@PatchMapping` ou `@DeleteMapping`
- abaixo dela, o status esperado com `@ResponseStatus`

## Services

Services concentram o fluxo da funcionalidade.

Cada service representa um caso de uso especifico e deve chamar, quando fizer
sentido:

- validator
- repository
- mapper

Padrao esperado:

```java
public CriarProdutoResponse criar(CriarProdutoRequest request) {
    produtoValidator.validarCriacao(request);
    var produto = produtoMapper.toEntity(request);
    var produtoSalvo = produtoRepository.save(produto);
    return produtoMapper.toCriarProdutoResponse(produtoSalvo);
}
```

A service pode coordenar regras de negocio, mas deve delegar:

- validacoes para validators
- persistencia para repositories
- conversoes para mappers

Nomes de services devem terminar com `Service` e indicar a funcao:

- `CriarProdutoService`
- `ListarProdutoService`
- `DetalharProdutoService`
- `AtualizarProdutoService`
- `ExcluirProdutoService`
- `CriarPedidoService`
- `AtualizarStatusPedidoService`

## Validators

Validators devem centralizar validacoes de negocio.

Use validators para regras como:

- loja precisa existir
- slug nao pode estar em uso
- produto precisa pertencer a loja correta
- categoria precisa estar ativa
- complemento precisa respeitar minimo e maximo
- pedido nao pode ser criado se a loja estiver fechada

Cada contexto deve ter seu proprio validator.

Validator simples:

- valida campos e regras que ja estao disponiveis em memoria
- nao acessa repository

Validator service:

- fica dentro de `validator/service`
- pode acessar repositories
- valida regras que dependem do banco

Exemplo:

```text
cardapio/
  categorias/
    validator/
      CategoriaValidator.java
      service/
        ValidarCategoriaExisteService.java
        ValidarCategoriaPertenceALojaService.java
```

## Mappers

O projeto deve usar mappers comuns anotados com `@Component`.

Nao use MapStruct por enquanto. Os mappers devem ser classes concretas com
conversoes explicitas e, sempre que possivel, usando `builder()` para criar
entities e DTOs de response.

Padrao de nomes dos metodos:

- `toEntity`
- `toCriarProdutoResponse`
- `toListarProdutoResponse`
- `toDetalharProdutoResponse`
- `toAtualizarProdutoResponse`

Use sempre o prefixo `to` para conversoes.

Exemplo:

```java
@Component
public class ProdutoMapper {

    public Produto toEntity(CriarProdutoRequest request) {
        return Produto.builder()
            .nome(request.nome())
            .ativo(true)
            .build();
    }

    public CriarProdutoResponse toCriarProdutoResponse(Produto produto) {
        return CriarProdutoResponse.builder()
            .id(produto.getId())
            .nome(produto.getNome())
            .ativo(produto.getAtivo())
            .build();
    }
}
```

Nao faca conversao manual em controller ou service quando existir mapper para o
contexto.

## Repositories

Repository deve ser um por entidade e deve ficar no dominio dono da entidade.

Exemplos:

- `cardapio.repository.CategoriaRepository`
- `lojas.repository.LojaRepository`
- `pedidos.repository.PedidoRepository`
- `crm.repository.ClienteRepository`

Repositories devem cuidar apenas de acesso a dados. Nao coloque regra de
negocio no repository.

## Entities

Cada entidade deve ter seu proprio arquivo e ficar no dominio mais natural.

Exemplos:

- `cardapio.entity.Categoria`
- `cardapio.entity.Produto`
- `cardapio.entity.GrupoComplemento`
- `lojas.entity.Loja`
- `pedidos.entity.Pedido`
- `crm.entity.Cliente`

Entidades representam o modelo persistido no banco. Evite usar entity como
request ou response de API.

## DTOs

O projeto tera muitos DTOs. Isso e intencional.

Cada funcionalidade deve ter requests e responses especificos, mesmo quando os
campos forem iguais em um primeiro momento.

Nao reutilize DTO so porque a estrutura parece identica hoje.

Padrao de nome:

- `<Funcao>Request`
- `<Funcao>Response`

Exemplos:

- `CriarProdutoRequest`
- `CriarProdutoResponse`
- `ListarProdutoResponse`
- `DetalharProdutoResponse`
- `AtualizarProdutoRequest`
- `AtualizarProdutoResponse`
- `CriarCategoriaRequest`
- `CriarCategoriaResponse`

Se existir uma rota para listar e outra para detalhar, elas devem ter responses
separados, mesmo que os campos sejam iguais agora.

## Padrao de organizacao por caso de uso

Exemplo para categorias:

```text
cardapio/
  categorias/
    controller/
      CategoriasController.java
    dto/
      CriarCategoriaRequest.java
      CriarCategoriaResponse.java
      ListarCategoriaResponse.java
      DetalharCategoriaResponse.java
      AtualizarCategoriaRequest.java
      AtualizarCategoriaResponse.java
    mapper/
      CategoriaMapper.java
    service/
      CriarCategoriaService.java
      ListarCategoriaService.java
      DetalharCategoriaService.java
      AtualizarCategoriaService.java
      ExcluirCategoriaService.java
    validator/
      CategoriaValidator.java
      service/
        ValidarCategoriaExisteService.java
        ValidarLojaCategoriaExisteService.java
        ValidarNomeCategoriaDisponivelService.java
  entity/
    Categoria.java
  repository/
    CategoriaRepository.java
```

O mesmo padrao deve ser repetido para produtos, complementos, pedidos e demais
contextos.

## Regra final

Antes de criar codigo novo, confira se a implementacao respeita:

- codigo no dominio correto
- controller sem logica
- service coordenando o caso de uso
- validator com validacoes de negocio
- mapper com conversoes
- repository apenas com acesso a banco
- DTOs separados por funcao
- nomes claros seguindo o padrao do projeto
