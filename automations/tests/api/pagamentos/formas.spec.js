import { test } from '../../../fixtures/api.fixture.js';

test('cria lista detalha atualiza e exclui forma de pagamento', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  formasPagamentoService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await formasPagamentoService.validarListagem(
    usuarioLogado.lojaId,
    catalogoCompleto.formaPagamento
  );
  await formasPagamentoService.validarDetalhe(
    catalogoCompleto.formaPagamento.id,
    catalogoCompleto.formaPagamento,
    usuarioLogado.token
  );
  await formasPagamentoService.validarAtualizacao(
    catalogoCompleto.formaPagamento.id,
    catalogoCompleto.formaPagamentoInativa,
    usuarioLogado.token
  );
  await formasPagamentoService.validarExclusao(
    catalogoCompleto.formaPagamento.id,
    usuarioLogado.token
  );
});

test('rejeita forma de pagamento duplicada', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  formasPagamentoService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await formasPagamentoService.validarDuplicidade(
    catalogoCompleto.formaPagamentoPayload,
    usuarioLogado.token
  );
});
