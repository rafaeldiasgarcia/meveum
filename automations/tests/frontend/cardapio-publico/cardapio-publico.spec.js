import { test } from '../../../fixtures/frontend.fixture.js';

test('renderiza vitrine publica criada pelo preset', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
  cardapioPublicoDinamico,
  cardapioPublicoPage,
}) => {
  await cardapioPublicoPage.abrir(cardapioPublicoDinamico.slug);
  await cardapioPublicoPage.validarCabecalho(cardapioPublicoDinamico.lojaNome);
  await cardapioPublicoPage.validarCategoria(
    cardapioPublicoDinamico.categoriaId,
    cardapioPublicoDinamico.categoriaNome
  );
  await cardapioPublicoPage.validarProduto(
    cardapioPublicoDinamico.produtoId,
    cardapioPublicoDinamico.produtoNome
  );
});

test('filtra a vitrine publica e sinaliza busca sem resultados', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
  cardapioPublicoDinamico,
  cardapioPublicoPage,
}) => {
  await cardapioPublicoPage.abrir(cardapioPublicoDinamico.slug);
  await cardapioPublicoPage.validarBuscaSemResultado(cardapioPublicoDinamico.buscaSemResultado);
});

test('abre modal do produto dinamico', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
  cardapioPublicoDinamico,
  cardapioPublicoPage,
}) => {
  await cardapioPublicoPage.abrir(cardapioPublicoDinamico.slug);
  await cardapioPublicoPage.abrirProduto(cardapioPublicoDinamico.produtoId);
  await cardapioPublicoPage.validarModalProduto();
});
