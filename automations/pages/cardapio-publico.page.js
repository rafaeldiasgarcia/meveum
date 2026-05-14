import { expect } from '@playwright/test';

export class CardapioPublicoPage {
  constructor(page) {
    this.page = page;
    this.nomeLoja = page.getByTestId('public-store-name');
    this.statusLoja = page.getByTestId('public-store-status');
    this.busca = page.getByTestId('public-menu-search-input');
    this.buscaVazia = page.getByTestId('public-search-empty');
    this.modalProduto = page.getByTestId('public-product-modal');
    this.botaoAdicionarProduto = page.getByTestId('public-product-add-button');
    this.botaoAbrirCarrinho = page.getByTestId('public-cart-open-button');
    this.carrinho = page.getByTestId('public-cart-drawer');
    this.botaoCheckout = page.getByTestId('public-cart-checkout-button');
    this.checkout = page.getByTestId('checkout-drawer');
    this.checkoutSucesso = page.getByTestId('checkout-success');
    this.botaoContinuarCheckout = page.getByTestId('checkout-continue-button');
    this.botaoConfirmarCheckout = page.getByTestId('checkout-confirm-button');
    this.nomeCheckout = page.getByTestId('checkout-name-input');
    this.telefoneCheckout = page.getByTestId('checkout-phone-input');
    this.observacaoCheckout = page.getByTestId('checkout-note-input');
    this.ruaCheckout = page.getByTestId('checkout-street-input');
    this.numeroCheckout = page.getByTestId('checkout-number-input');
    this.complementoCheckout = page.getByTestId('checkout-complement-input');
    this.bairroCheckout = page.getByTestId('checkout-neighborhood-input');
    this.cepCheckout = page.getByTestId('checkout-zip-input');
    this.cidadeCheckout = page.getByTestId('checkout-city-input');
    this.estadoCheckout = page.getByTestId('checkout-state-input');
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
    await expect(this.modalProduto).toBeVisible();
    await expect(this.botaoAdicionarProduto).toBeVisible();
  }

  async adicionarProdutoAoCarrinho(produtoId) {
    await this.abrirProduto(produtoId);
    await this.validarModalProduto();
    await this.botaoAdicionarProduto.click();
    await expect(this.botaoAbrirCarrinho).toBeVisible();
  }

  async abrirCheckout() {
    await this.botaoAbrirCarrinho.click();
    await expect(this.carrinho).toBeVisible();
    await this.botaoCheckout.click();
    await expect(this.checkout).toBeVisible();
  }

  async concluirPedidoPickup(checkout) {
    await this.preencherTipo(checkout);
    await this.preencherDadosCliente(checkout);
    await this.preencherPagamento(checkout);
    await this.confirmarPedido();
  }

  async concluirPedidoDelivery(checkout) {
    await this.preencherTipo(checkout);
    await this.preencherDadosCliente(checkout);
    await this.preencherEndereco(checkout);
    await this.preencherPagamento(checkout);
    await this.confirmarPedido();
  }

  async preencherTipo(checkout) {
    await this.page.getByTestId(`checkout-type-${checkout.tipo.toLowerCase()}`).click();
    await this.continuar();
  }

  async preencherDadosCliente(checkout) {
    await this.nomeCheckout.fill(checkout.nome);
    await this.telefoneCheckout.fill(checkout.telefone);
    await this.observacaoCheckout.fill(checkout.observacao);
    await this.continuar();
  }

  async preencherEndereco(checkout) {
    await this.ruaCheckout.fill(checkout.rua);
    await this.numeroCheckout.fill(checkout.numero);
    await this.complementoCheckout.fill(checkout.complemento);
    await this.bairroCheckout.fill(checkout.bairro);
    await this.cepCheckout.fill(checkout.cep);
    await this.cidadeCheckout.fill(checkout.cidade);
    await this.estadoCheckout.fill(checkout.estado);
    await this.page.getByTestId(`checkout-area-${checkout.areaEntregaId}`).click();
    await this.continuar();
  }

  async preencherPagamento(checkout) {
    await this.page.getByTestId(`checkout-payment-${checkout.formaPagamento}`).click();
    await this.continuar();
  }

  async confirmarPedido() {
    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/pedidos') && response.status() === 201),
      this.botaoConfirmarCheckout.click(),
    ]);
    const popup = await popupPromise;
    await popup?.close();
    await expect(this.checkoutSucesso).toBeVisible();
  }

  async continuar() {
    await this.botaoContinuarCheckout.click();
  }
}
