# AGENTS.md - Padroes do projeto Meveum

Este arquivo define os padroes que devem ser seguidos no backend do Meveum.
Antes de implementar qualquer funcionalidade, leia e respeite estas regras.

## Arquitetura geral

O backend segue um monolito modular organizado por dominios.

Cada dominio deve concentrar seus proprios casos de uso, DTOs, mappers,
validators, repositories e entities quando eles pertencerem ao dominio.
Codigo compartilhado entre dominios deve ficar em `shared`.

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

## Roadmap de implementacao

Siga esta ordem preferencial para evoluir o backend. A ordem existe para que
cada etapa desbloqueie testes manuais e funcionalidades reais do sistema.

1. `cardapio/categorias`
   - Status: concluido.
   - Manter CRUD, validators, mapper e testes unitarios como referencia para
     os proximos contextos.

2. `cardapio/produtos`
   - Status: concluido.
   - Implementar CRUD de produtos.
   - Produto deve pertencer a uma loja e, quando informado, a uma categoria da
     mesma loja.
   - Cobrir services, validators e mapper com testes unitarios.
   - Campos esperados inicialmente: nome, descricao, preco, imagem, ordem,
     ativo e categoria.

3. `cardapio/complementos`
   - Status: concluido.
   - Implementar grupos de complemento.
   - Implementar opcoes de complemento.
   - Implementar vinculo produto x grupo de complemento.
   - Validar minimo, maximo, obrigatoriedade e pertencimento a loja.

4. `lojas`
   - Status: concluido parcialmente.
   - Implementar consulta e atualizacao dos dados principais da loja.
   - Implementar pausa manual e status operacional.
   - Depois evoluir para horarios de funcionamento.

5. `entrega`
   - Status: concluido.
   - Implementar areas/regras de entrega da loja.
   - Validar tipo de area, taxa, pedido minimo e compatibilidade com loja.

6. `pagamentos`
   - Status: concluido.
   - Implementar formas de pagamento aceitas pela loja.
   - Validar tipo de pagamento, ativo/inativo e regras por loja.

7. `crm/clientes`
   - Status: concluido.
   - Implementar cadastro e consulta de clientes.
   - Implementar enderecos de cliente.
   - Preparar reutilizacao no fluxo de pedido.

8. `pedidos`
   - Status: concluido.
   - Implementar criacao de pedido.
   - Calcular totais a partir de produtos e complementos.
   - Validar loja aberta, produtos ativos, complementos validos e endereco.
   - Implementar atualizacao de status.

9. `dashboard`
   - Status: concluido.
   - Implementar metricas basicas apos pedidos existirem.
   - Priorizar faturamento, quantidade de pedidos e produtos mais vendidos.

10. `integracao_whatsapp`
    - Status: proximo.
    - Implementar apenas depois que pedidos e status estiverem estaveis.
    - Preparar envio de notificacoes e mensagens operacionais.

Ao iniciar um item do roadmap, mantenha o padrao de arquitetura deste arquivo e
crie commits separados por contexto.

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
