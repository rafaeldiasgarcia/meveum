import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('dashboard autenticado', () => {
  test.beforeEach(async ({ dashboardResumoPage, sessaoUsuarioLogadoNoBrowser }) => {
    await dashboardResumoPage.abrir();
  });

  test('exibe cards, grafico e pedidos recentes', { tag: ['@frontend', '@smoke', '@regressao'] }, async ({
    dashboardResumoPage,
  }) => {
    await dashboardResumoPage.validarCardsEGrafico();
    await dashboardResumoPage.validarPedidosRecentes();
  });

  test('navega para a tela de pedidos pelo atalho do resumo', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
    dashboardResumoPage,
  }) => {
    await dashboardResumoPage.navegarParaPedidos();
  });
});
