# AGENTS.md - Padroes do projeto Meveum

Este arquivo define os padroes que devem ser seguidos no backend do Meveum.
Antes de implementar qualquer funcionalidade, leia e respeite estas regras.

## Arquitetura geral

O backend segue um **monolito modular organizado por domínios**.

Cada domínio é independente e contém suas próprias camadas:

```
src/main/java/br/com/meveum/
├── cardapio/              ← Domínio de gestão de cardápio
├── pedidos/               ← Domínio de gestão de pedidos
├── pagamentos/            ← Domínio de pagamentos
├── entrega/               ← Domínio de entregas
├── crm/                   ← Domínio de clientes
├── dashboard/             ← Domínio de analytics
├── integracao_whatsapp/   ← Domínio de WhatsApp
└── shared/                ← Código compartilhado entre domínios
```

Dentro de cada domínio, separe as responsabilidades em camadas:

- Controller
- Service
- Validator
- Mapper
- Repository
- Entity
- DTOs de request e response

Cada camada deve ter uma responsabilidade unica. Nao misture regras de negocio,
validacoes, conversoes ou acesso a banco fora da camada correta.

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
    return produtoService.criar(request);
}
```

Toda rota deve declarar:

- a anotacao do verbo HTTP: `@GetMapping`, `@PostMapping`, `@PutMapping`,
  `@PatchMapping` ou `@DeleteMapping`
- abaixo dela, o status esperado com `@ResponseStatus`

## Services

Services concentram o fluxo da funcionalidade.

A service deve chamar, quando fizer sentido para o caso de uso:

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

Exemplos:

- `StoreValidator`
- `ProductValidator`
- `CategoryValidator`
- `OrderValidator`

Evite deixar validacao de negocio espalhada em controller, mapper ou repository.

Quando uma validacao precisar acessar repository ou depender de outra consulta
de dados, ela deve virar um validator service.

Validator simples:

- valida campos e regras que ja estao disponiveis em memoria
- nao acessa repository

Validator service:

- fica dentro de uma pasta propria dentro de `validators`
- pode acessar repositories
- valida regras que dependem do banco

Exemplos:

```text
validators/
  categorias/
    CategoriaValidator.java
    services/
      ValidarCategoriaExisteService.java
      ValidarCategoriaPertenceALojaService.java
```

## Mappers

O projeto deve usar mappers comuns anotados com `@Component`.

Nao use MapStruct por enquanto. Os mappers devem ser classes concretas com
conversoes explicitas e, sempre que possivel, usando `builder()` para criar
entities e DTOs de response.

Cada mapper deve ser responsavel por um contexto principal.

Exemplos:

- `StoreMapper`
- `ProductMapper`
- `CategoryMapper`
- `OrderMapper`

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

    public ListarProdutoResponse toListarProdutoResponse(Produto produto) {
        return ListarProdutoResponse.builder()
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

Repository deve ser um por entidade.

Exemplos:

- `StoreRepository` para `Store`
- `ProductRepository` para `Product`
- `CategoryRepository` para `Category`
- `OrderRepository` para `Order`

Repositories devem cuidar apenas de acesso a dados.

Nao coloque regra de negocio no repository.

## Entities

Cada entidade deve ter seu proprio arquivo.

Exemplos:

- `Store`
- `Product`
- `Category`
- `ComplementGroup`
- `ComplementOption`
- `Order`
- `OrderItem`

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
separados:

- `ListarProdutoResponse`
- `DetalharProdutoResponse`

Mesmo que os campos sejam iguais agora, mantenha DTOs separados para evitar
acoplamento entre casos de uso diferentes.

## Organizacao por camada e caso de uso

Organize os arquivos por camada e, dentro da camada, por contexto de negocio.
Services devem representar casos de uso especificos.

Exemplo:

```text
controllers/
  CategoriasController.java

services/
  categorias/
    CriarCategoriaService.java
    ListarCategoriaService.java
    DetalharCategoriaService.java
    AtualizarCategoriaService.java
    ExcluirCategoriaService.java

validators/
  categorias/
    CategoriaValidator.java
    services/
      ValidarCategoriaExisteService.java
      ValidarCategoriaPertenceALojaService.java

mappers/
  CategoriaMapper.java

repositories/
  CategoriaRepository.java

entities/
  Categoria.java

dtos/
  categorias/
    CriarCategoriaRequest.java
    CriarCategoriaResponse.java
    ListarCategoriaResponse.java
    DetalharCategoriaResponse.java
    AtualizarCategoriaRequest.java
    AtualizarCategoriaResponse.java
```

O mesmo padrao deve ser repetido para lojas, produtos, categorias,
complementos, pedidos e demais contextos.

Nomes de services devem terminar com `Service` e indicar a funcao:

- `CriarProdutoService`
- `ListarProdutoService`
- `DetalharProdutoService`
- `AtualizarProdutoService`
- `ExcluirProdutoService`
- `CriarPedidoService`
- `AtualizarStatusPedidoService`

## Padroes obrigatorios por arquivo

Para cada novo contexto, crie arquivos especificos quando forem necessarios:

- uma entity por arquivo
- um repository por entity
- uma service por contexto
- um validator por contexto
- um mapper por contexto
- DTOs separados por funcionalidade
- controller sem logica, apenas chamando service

## Regra final

Antes de criar codigo novo, confira se a implementacao respeita:

- controller sem logica
- service coordenando o caso de uso
- validator com validacoes de negocio
- mapper com conversoes
- repository apenas com acesso a banco
- DTOs separados por funcao
- nomes claros seguindo o padrao do projeto
