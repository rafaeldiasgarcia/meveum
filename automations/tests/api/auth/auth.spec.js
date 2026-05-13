import { test } from '../../../fixtures/api.fixture.js';

test('registra, autentica e consulta o usuario dinamico', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  authService,
  usuarioLogado,
}) => {
  await authService.validarUsuarioAutenticado(usuarioLogado.token, usuarioLogado.usuario);
});

test('rejeita login com senha invalida', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  authService,
  usuarioLogado,
}) => {
  await authService.validarLoginInvalido(usuarioLogado.loginInvalido);
});

test('rejeita novo cadastro com email ja utilizado', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  authService,
  usuarioLogado,
}) => {
  await authService.validarRegistroDuplicado(usuarioLogado.cadastroDuplicado);
});

test('rejeita cadastro sem dados obrigatorios', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  authService,
  usuarioLogado,
}) => {
  await authService.validarRegistroInvalido(usuarioLogado.cadastroInvalido);
});

test('bloqueia consulta do usuario autenticado sem jwt', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  authService,
}) => {
  await authService.validarBloqueioSemToken();
});
