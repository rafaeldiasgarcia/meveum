import { test } from '../../../fixtures/frontend.fixture.js';

test('autentica pelo formulario com usuario criado pela fixture', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
  dashboardPage,
  loginPage,
  sessaoBrowserService,
  usuarioLogado,
}) => {
  await loginPage.abrir();
  await loginPage.autenticar(usuarioLogado.loginPayload);
  await dashboardPage.validarUsuarioExibido(usuarioLogado.usuario.nome);
  await sessaoBrowserService.validarUsuarioPersistido(usuarioLogado.usuario);
});

test('cadastra usuario novo pelo formulario', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
  authService,
  dashboardPage,
  novoCadastroFrontend,
  registerPage,
}) => {
  await registerPage.abrir();
  await registerPage.cadastrar(novoCadastroFrontend);
  await dashboardPage.validarUsuarioExibido(novoCadastroFrontend.nome);
  await authService.validarLoginDoCadastro(novoCadastroFrontend);
});

test('mostra validacoes obrigatorias no login', { tag: ['@frontend', '@negativo', '@regressao'] }, async ({
  loginPage,
}) => {
  await loginPage.abrir();
  await loginPage.enviarSemPreencher();
  await loginPage.validarErrosObrigatorios();
});

test('mostra validacoes obrigatorias no cadastro', { tag: ['@frontend', '@negativo', '@regressao'] }, async ({
  registerPage,
}) => {
  await registerPage.abrir();
  await registerPage.enviarSemPreencher();
  await registerPage.validarErrosObrigatorios();
});
