import { expect } from '@playwright/test';

export class CardapioPublicoPage {
  constructor(page) {
    this.page = page;
    this.nomeLoja = page.getByTestId('public-store-name');
    this.statusLoja = page.getByTestId('public-store-status');
    this.busca = page.getByTestId('public-menu-search-input');
    this.buscaVazia = page.getByTestId('public-search-empty');
  }

  async abrir(slug) {
    await this.page.goto(`/${slug}`);
    await expect(this.nomeLoja).toBeVisible();
  }

  async validarCabecalho(nomeLoja) {
    await expect(this.nomeLoja).toHaveText(nomeLoja);
    await expect(this.statusLoja).toBeVisible();
  }

  async validarCategoria(categoriaId, nomeCategoria) {
    await expect(this.page.getByTestId(`public-category-${categoriaId}`)).toHaveText(nomeCategoria);
    await expect(this.page.getByTestId(`public-category-section-${categoriaId}`)).toBeVisible();
  }

  async validarProduto(produtoId, nomeProduto) {
    await expect(this.page.getByTestId(`public-product-card-${produtoId}`)).toBeVisible();
    await expect(this.page.getByTestId(`public-product-name-${produtoId}`)).toHaveText(nomeProduto);
  }

  async validarBuscaSemResultado(termo) {
    await this.busca.fill(termo);
    await expect(this.buscaVazia).toBeVisible();
  }

  async abrirProduto(produtoId) {
    await this.page.getByTestId(`public-product-card-${produtoId}`).click();
  }

  async validarModalProduto() {
    await expect(this.page.getByRole('button', { name: /Adicionar ao carrinho/i })).toBeVisible();
  }
}
