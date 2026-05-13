import { test } from '../../../fixtures/api.fixture.js';

test('consolida resumo e ranking do dashboard autenticado', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  dashboardComMovimento,
  dashboardService,
  periodoDashboard,
  usuarioLogado,
}) => {
  await dashboardService.validarResumo(usuarioLogado.lojaId, periodoDashboard, usuarioLogado.token);
  await dashboardService.validarRanking(usuarioLogado.lojaId, periodoDashboard, usuarioLogado.token);
});
