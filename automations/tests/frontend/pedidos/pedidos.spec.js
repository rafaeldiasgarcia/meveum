import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('gestao visual de pedidos', () => {
  test.beforeEach(async ({ pedidoPickup, pedidosPage, sessaoUsuarioLogadoNoBrowser }) => {
    await pedidosPage.abrir();
  });

  test('lista pedidos e abre detalhe', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
    pedidosPage,
  }) => {
    await pedidosPage.validarLista();
    await pedidosPage.abrirPrimeiroPedido();
    await pedidosPage.validarDetalhe();
  });

  test('permite avancar status no detalhe quando a acao existe', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
    pedidosPage,
  }) => {
    await pedidosPage.validarLista();
    await pedidosPage.abrirPrimeiroPedido();
    await pedidosPage.avancarStatusQuandoDisponivel();
  });
});
