import { test } from '../../../fixtures/frontend.fixture.js';

test('restaura sessao persistida e exibe o usuario correto', { tag: ['@frontend', '@smoke', '@regressao'] }, async ({
  dashboardPage,
  sessaoBrowserService,
  sessaoUsuarioLogadoNoBrowser,
}) => {
  await dashboardPage.abrir();
  await dashboardPage.validarUsuarioExibido(sessaoUsuarioLogadoNoBrowser.usuario.nome);
  await sessaoBrowserService.validarSessao(sessaoUsuarioLogadoNoBrowser);
});

test('redireciona visitante sem token para login', { tag: ['@frontend', '@negativo', '@contrato'] }, async ({
  dashboardPage,
}) => {
  await dashboardPage.abrir();
  await dashboardPage.validarRedirecionamentoParaLogin();
});

test('encerra sessao e limpa o armazenamento local', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
  dashboardPage,
  sessaoBrowserService,
  sessaoUsuarioLogadoNoBrowser,
}) => {
  await dashboardPage.abrir();
  await dashboardPage.validarUsuarioExibido(sessaoUsuarioLogadoNoBrowser.usuario.nome);
  await dashboardPage.sair();
  await sessaoBrowserService.validarSessaoLimpa();
});
