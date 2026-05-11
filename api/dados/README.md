# Dados de desenvolvimento

Esta pasta guarda arquivos auxiliares para desenvolvimento local. Nao confundir
com `data/`, que e o volume local do PostgreSQL.

## Dados de teste do Bruno

O Flyway cria/atualiza os dados de teste pela migration
`V2__insert_test_data_for_bruno.sql`.

```txt
lojaId: 11111111-1111-1111-1111-111111111111
categoriaId: 22222222-2222-2222-2222-222222222222
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

1. Rode `01 - Criar Categoria`.
2. Rode listar, detalhar, atualizar e excluir usando o `categoriaId` de teste.
