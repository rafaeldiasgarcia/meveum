import { test } from '../../fixtures/e2e.fixture.js';

test('cria pedido pickup pela vitrine publica e avanca status no painel', { tag: ['@e2e', '@smoke', '@regressao'] }, async ({
  catalogoCompleto,
  checkoutPickupE2E,
  fluxoE2EService,
  lojaAtualizavel,
  usuarioLogado,
}) => {
  await fluxoE2EService.validarPedidoPickup(catalogoCompleto, checkoutPickupE2E, lojaAtualizavel.loja, usuarioLogado);
});

test('cria pedido delivery e reflete em dashboard e clientes', { tag: ['@e2e', '@regressao', '@contrato'] }, async ({
  catalogoCompleto,
  checkoutDeliveryE2E,
  fluxoE2EService,
  lojaAtualizavel,
  usuarioLogado,
}) => {
  await fluxoE2EService.validarPedidoDelivery(catalogoCompleto, checkoutDeliveryE2E, lojaAtualizavel.loja, usuarioLogado);
});
