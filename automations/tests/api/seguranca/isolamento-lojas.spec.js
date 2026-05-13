import { test } from '../../../fixtures/api.fixture.js';

test('nega alteracao de loja por outro usuario autenticado', { tag: ['@api', '@negativo', '@contrato', '@regressao'] }, async ({
  lojaAtualizavel,
  lojasService,
  segundoUsuarioLogado,
  usuarioLogado,
}) => {
  await lojasService.validarAcessoNegadoAtualizacao(
    usuarioLogado.lojaId,
    lojaAtualizavel.atualizar,
    segundoUsuarioLogado.token
  );
});

test('nega leitura de categoria pertencente a outra loja', { tag: ['@api', '@negativo', '@contrato', '@regressao'] }, async ({
  catalogoCompleto,
  categoriasService,
  segundoUsuarioLogado,
}) => {
  await categoriasService.validarAcessoNegadoDetalhe(
    catalogoCompleto.categoria.id,
    segundoUsuarioLogado.token
  );
});

test('nega listagem de pedidos de outra loja', { tag: ['@api', '@negativo', '@contrato', '@regressao'] }, async ({
  pedidosService,
  pedidoPickup,
  segundoUsuarioLogado,
  usuarioLogado,
}) => {
  await pedidosService.validarAcessoNegadoListagem(
    usuarioLogado.lojaId,
    segundoUsuarioLogado.token
  );
});

test('nega resumo de dashboard de outra loja', { tag: ['@api', '@negativo', '@contrato', '@regressao'] }, async ({
  dashboardComMovimento,
  dashboardService,
  periodoDashboard,
  segundoUsuarioLogado,
  usuarioLogado,
}) => {
  await dashboardService.validarAcessoNegadoResumo(
    usuarioLogado.lojaId,
    periodoDashboard,
    segundoUsuarioLogado.token
  );
});
