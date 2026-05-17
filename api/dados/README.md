# Dados de desenvolvimento

Esta pasta guarda arquivos auxiliares para desenvolvimento local, como
collections Postman. Nao confundir com `api/data/postgres`, que e o volume local
do PostgreSQL criado pelo Docker Compose.

## Dados criados pelo Flyway

As migrations de seed (`V2` a `V10`) criam uma massa fixa para desenvolvimento,
testes manuais e Postman.

| Versao | Conteudo |
|---|---|
| `V2` | Loja base e usuario Bruno |
| `V3` | Categoria e produto base |
| `V4` | Grupo e opcao de complemento |
| `V5` | Area de entrega |
| `V6` | Forma de pagamento |
| `V7` | Cliente e endereco |
| `V8` | Pedido, item e complemento de pedido |
| `V9` | Usuario autenticavel para automacoes |
| `V10` | Vinculo entre produto e grupo de complemento |

## IDs fixos

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

Arquivo:

```txt
dados/postman/meveum-api.postman_collection.json
```

Fluxo sugerido:

1. Suba o banco com `docker compose up -d`.
2. Suba a API com `./mvnw spring-boot:run` ou `.\mvnw.cmd spring-boot:run`.
3. Use os requests de login/cadastro para obter JWT.
4. Use os IDs fixos para listar, detalhar, atualizar e excluir.
5. Para criacao, prefira nomes novos para evitar duplicidade.

## Observacoes

- A massa fixa e util para testes manuais.
- Automacoes novas devem preferir dados dinamicos via services/presets quando
  precisarem ser independentes.
- Se uma migration de seed mudar algum ID fixo, atualize este README e a
  collection Postman na mesma PR.
