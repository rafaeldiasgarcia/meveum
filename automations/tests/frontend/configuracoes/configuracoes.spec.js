import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('configuracoes da loja', () => {
  test.beforeEach(async ({ configuracoesPage, sessaoUsuarioLogadoNoBrowser }) => {
    await configuracoesPage.abrir();
  });

  test('renderiza status, formulario, horarios e taxas', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
    configuracoesPage,
  }) => {
    await configuracoesPage.validarSecoes();
    await configuracoesPage.validarBotaoAdicionarTaxa();
  });

  test('permite alternar status e salvar configuracoes basicas', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
    configuracoesPage,
  }) => {
    await configuracoesPage.alternarLoja();
    await configuracoesPage.salvarDados();
    await configuracoesPage.salvarHorarios();
  });
});
