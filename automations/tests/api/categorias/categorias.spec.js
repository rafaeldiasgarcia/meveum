import { test } from '../../../fixtures/api.fixture.js';

test('cria lista detalha e atualiza categoria da loja', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  categoriasService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await categoriasService.validarListagem(usuarioLogado.lojaId, catalogoCompleto.categoria);
  await categoriasService.validarDetalhe(
    catalogoCompleto.categoria.id,
    usuarioLogado.token,
    catalogoCompleto.categoria
  );
  await categoriasService.validarAtualizacao(
    catalogoCompleto.categoria.id,
    catalogoCompleto.categoriaAtualizada,
    usuarioLogado.token
  );
});

test('rejeita categoria duplicada na mesma loja', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  categoriasService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await categoriasService.validarDuplicidade(
    catalogoCompleto.categoriaPayload,
    usuarioLogado.token
  );
});

test('bloqueia criacao de categoria sem autenticacao', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  categoriasService,
  catalogoCompleto,
}) => {
  await categoriasService.validarBloqueioSemToken(catalogoCompleto.categoriaPayload);
});

test('exclui categoria sem dependencias ativas', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  categoriasService,
  categoriaDescartavel,
  usuarioLogado,
}) => {
  await categoriasService.validarExclusao(categoriaDescartavel.id, usuarioLogado.token);
});
