import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('dashboard autenticado', () => {
  test.beforeEach(async ({ dashboardComMovimento, dashboardResumoPage, sessaoUsuarioLogadoNoBrowser }) => {
    await dashboardResumoPage.abrir();
  });

  test('exibe cards, grafico e pedidos recentes', { tag: ['@frontend', '@smoke', '@regressao'] }, async ({
    dashboardResumoPage,
  }) => {
    await dashboardResumoPage.validarCardsEGrafico();
    await dashboardResumoPage.validarPedidosRecentes();
  });

  // TODO(#57): reativar cobertura para metric-card-preparing,
  // metric-card-new-clients, metric-card-repurchase e
  // ver-todos-pedidos-button quando esses elementos voltarem como parte
  // visivel e utilizavel do dashboard. Eles nao devem existir escondidos
  // apenas para satisfazer a automacao.
});
