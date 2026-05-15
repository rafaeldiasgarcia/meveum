import { test } from '../../fixtures/e2e.fixture.js';

test('cadastra usuario, valida banco, encerra sessao e autentica novamente', { tag: ['@e2e', '@smoke', '@regressao'] }, async ({
  cadastroE2E,
  fluxoE2EService,
}) => {
  await fluxoE2EService.validarCadastroLoginLogout(cadastroE2E);
});

test('solicita recuperacao, valida token no banco, redefine senha e autentica', { tag: ['@e2e', '@regressao', '@contrato'] }, async ({
  fluxoE2EService,
  redefinicaoSenhaE2E,
  usuarioLogado,
}) => {
  await fluxoE2EService.validarRecuperacaoSenha(usuarioLogado, redefinicaoSenhaE2E);
});
