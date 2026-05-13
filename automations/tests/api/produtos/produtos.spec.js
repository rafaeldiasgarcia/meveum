import { test } from '../../../fixtures/api.fixture.js';

test('cria lista detalha filtra e atualiza produto', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  produtosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await produtosService.validarListagem(usuarioLogado.lojaId, catalogoCompleto.produto);
  await produtosService.validarFiltroPorCategoria(
    usuarioLogado.lojaId,
    catalogoCompleto.categoria.id,
    catalogoCompleto.produto
  );
  await produtosService.validarDetalhe(
    catalogoCompleto.produto.id,
    usuarioLogado.token,
    catalogoCompleto.produto
  );
  await produtosService.validarAtualizacao(
    catalogoCompleto.produto.id,
    catalogoCompleto.produtoAtualizado,
    usuarioLogado.token
  );
});

test('rejeita produto duplicado na mesma loja', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  produtosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await produtosService.validarDuplicidade(catalogoCompleto.produtoPayload, usuarioLogado.token);
});

test('exclui produto cadastrado', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  produtosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await produtosService.validarExclusao(catalogoCompleto.produto.id, usuarioLogado.token);
});
