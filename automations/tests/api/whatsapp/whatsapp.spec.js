import { test } from '../../../fixtures/api.fixture.js';

test('monta a mensagem de whatsapp do pedido criado', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  pedidoPickup,
  whatsappService,
}) => {
  await whatsappService.validarMensagem(pedidoPickup.pedido);
});
