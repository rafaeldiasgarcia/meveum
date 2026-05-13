import { test } from '../../../fixtures/api.fixture.js';

test('gerencia grupos de complemento da loja', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  complementosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await complementosService.validarListagemGrupo(
    usuarioLogado.lojaId,
    catalogoCompleto.grupo,
    usuarioLogado.token
  );
  await complementosService.validarDetalheGrupo(
    catalogoCompleto.grupo.id,
    catalogoCompleto.grupo,
    usuarioLogado.token
  );
  await complementosService.validarAtualizacaoGrupo(
    catalogoCompleto.grupo.id,
    catalogoCompleto.grupoAtualizado,
    usuarioLogado.token
  );
});

test('gerencia opcoes de complemento da loja', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  complementosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await complementosService.validarListagemOpcao(catalogoCompleto.grupo.id, catalogoCompleto.opcao);
  await complementosService.validarDetalheOpcao(
    catalogoCompleto.opcao.id,
    catalogoCompleto.opcao,
    usuarioLogado.token
  );
  await complementosService.validarAtualizacaoOpcao(
    catalogoCompleto.opcao.id,
    catalogoCompleto.opcaoAtualizada,
    usuarioLogado.token
  );
});

test('lista e desvincula grupo associado ao produto', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  complementosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await complementosService.validarListagemProduto(
    catalogoCompleto.produto.id,
    catalogoCompleto.vinculo
  );
  await complementosService.validarDesvinculo(
    catalogoCompleto.produto.id,
    catalogoCompleto.grupo.id,
    usuarioLogado.token
  );
});

test('rejeita vinculo duplicado entre produto e grupo', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  complementosService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await complementosService.validarDuplicidadeVinculo(
    catalogoCompleto.produto.id,
    catalogoCompleto.vinculoPayload,
    usuarioLogado.token
  );
});
