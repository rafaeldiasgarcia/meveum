import { test } from '../../fixtures/e2e.fixture.js';

test('publica produto no admin, valida vitrine publica, alterna disponibilidade e remove', { tag: ['@e2e', '@smoke', '@regressao'] }, async ({
  fluxoE2EService,
  lojaAtualizavel,
  produtoAdminE2E,
  usuarioLogado,
}) => {
  await fluxoE2EService.validarPublicacaoProduto(lojaAtualizavel.loja, produtoAdminE2E, usuarioLogado);
});
