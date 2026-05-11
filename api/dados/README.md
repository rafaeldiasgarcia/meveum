# Dados de desenvolvimento

Esta pasta guarda arquivos auxiliares para desenvolvimento local. Nao confundir
com `data/`, que e o volume local do PostgreSQL.

## Dados de teste do Bruno

O Flyway cria/atualiza os dados de teste pelas migrations `V2`, `V3` e `V4`.

```txt
lojaId: 11111111-1111-1111-1111-111111111111
categoriaId: 22222222-2222-2222-2222-222222222222
produtoId: 33333333-3333-3333-3333-333333333333
grupoComplementoId: 44444444-4444-4444-4444-444444444444
opcaoComplementoId: 55555555-5555-5555-5555-555555555555
```

## Collection Bruno

Para importar pela tela `Import Collection`, use o arquivo:

```txt
dados/bruno/meveum-api.postman_collection.json
```

Tambem existe uma collection no formato nativo do Bruno em:

```txt
dados/bruno/meveum-api
```

Selecione o environment `Local`.

Fluxo sugerido com os dados de teste:

1. Rode listar, detalhar, atualizar e excluir usando os IDs fixos de teste.
2. Para criacao, use os requests com nomes `Nova` para evitar duplicidade.
