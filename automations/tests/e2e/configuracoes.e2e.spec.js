import { test } from '../../fixtures/e2e.fixture.js';

test('atualiza configuracoes da loja e valida persistencia no banco', { tag: ['@e2e', '@regressao', '@contrato'] }, async ({
  configuracaoLojaE2E,
  fluxoE2EService,
  usuarioLogado,
}) => {
  await fluxoE2EService.validarConfiguracoes(configuracaoLojaE2E, usuarioLogado);
});
