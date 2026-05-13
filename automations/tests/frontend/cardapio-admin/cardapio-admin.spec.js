import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('gestao visual de cardapio', () => {
  test.beforeEach(async ({ cardapioAdminPage, sessaoUsuarioLogadoNoBrowser }) => {
    await cardapioAdminPage.abrir();
  });

  test('lista produtos e exibe os filtros de categoria', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
    cardapioAdminPage,
  }) => {
    await cardapioAdminPage.validarLista();
    await cardapioAdminPage.validarFiltroTodas();
  });

  test('abre criacao de produto e valida obrigatoriedade do nome', { tag: ['@frontend', '@negativo', '@regressao'] }, async ({
    cardapioAdminPage,
  }) => {
    await cardapioAdminPage.abrirCriacao();
    await cardapioAdminPage.validarFormulario();
    await cardapioAdminPage.enviarProdutoIncompleto();
    await cardapioAdminPage.validarErroNome();
  });

  test('abre edicao do primeiro produto listado', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
    cardapioAdminPage,
  }) => {
    await cardapioAdminPage.validarLista();
    await cardapioAdminPage.abrirEdicaoPrimeiroProduto();
  });
});
