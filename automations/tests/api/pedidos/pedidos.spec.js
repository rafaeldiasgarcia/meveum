import { test } from '../../../fixtures/api.fixture.js';

test('cria consulta detalha e atualiza pedido pickup', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  pedidosService,
  pedidoPickup,
  usuarioLogado,
}) => {
  await pedidosService.validarListagem(usuarioLogado.lojaId, usuarioLogado.token, pedidoPickup.pedido);
  await pedidosService.validarDetalhe(pedidoPickup.pedido.id, usuarioLogado.token, pedidoPickup.pedido);
  await pedidosService.validarAtualizacaoStatus(
    pedidoPickup.pedido.id,
    pedidoPickup.proximoStatus,
    usuarioLogado.token
  );
});

test('cria pedido delivery com cliente endereco e area de entrega', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  pedidosService,
  pedidoDelivery,
  usuarioLogado,
}) => {
  await pedidosService.validarListagem(usuarioLogado.lojaId, usuarioLogado.token, pedidoDelivery.pedido);
  await pedidosService.validarDetalhe(
    pedidoDelivery.pedido.id,
    usuarioLogado.token,
    pedidoDelivery.pedido
  );
});

test('filtra pedidos por status', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  pedidosService,
  pedidoPickup,
  usuarioLogado,
}) => {
  await pedidosService.validarFiltroStatus(
    usuarioLogado.lojaId,
    usuarioLogado.token,
    pedidoPickup.pedido,
    pedidoPickup.pedido.status
  );
});

test('rejeita pedido delivery sem endereco cliente e area', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  pedidosService,
  pedidoDelivery,
}) => {
  await pedidosService.validarPedidoInvalido(pedidoDelivery.invalido);
});
