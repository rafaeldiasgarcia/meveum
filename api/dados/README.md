# Dados de desenvolvimento

Esta pasta guarda arquivos auxiliares para desenvolvimento local. Nao confundir
com `data/`, que e o volume local do PostgreSQL.

## Dados de teste

O Flyway cria/atualiza os dados de teste pelas migrations `V2`, `V3`, `V4`,
`V5`, `V6`, `V7` e `V8`.

```txt
lojaId: 11111111-1111-1111-1111-111111111111
categoriaId: 22222222-2222-2222-2222-222222222222
produtoId: 33333333-3333-3333-3333-333333333333
grupoComplementoId: 44444444-4444-4444-4444-444444444444
opcaoComplementoId: 55555555-5555-5555-5555-555555555555
areaEntregaId: 77777777-7777-7777-7777-777777777777
formaPagamentoId: 88888888-8888-8888-8888-888888888888
clienteId: 99999999-9999-9999-9999-999999999999
enderecoClienteId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
pedidoId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
itemPedidoId: cccccccc-cccc-cccc-cccc-cccccccccccc
complementoItemPedidoId: dddddddd-dddd-dddd-dddd-dddddddddddd
```

## Collection Postman

Para importar no Postman, use o arquivo:

```txt
dados/postman/meveum-api.postman_collection.json
```

Fluxo sugerido com os dados de teste:

1. Rode listar, detalhar, atualizar e excluir usando os IDs fixos de teste.
2. Para criacao, use os requests com nomes `Nova` para evitar duplicidade.
