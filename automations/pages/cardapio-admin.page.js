import { expect } from '@playwright/test';

export class CardapioAdminPage {
  constructor(page) {
    this.page = page;
    this.lista = page.getByTestId('produtos-list');
    this.botaoCriar = page.getByTestId('produto-criar-button');
    this.modalProduto = page.getByTestId('produto-modal');
    this.formularioProduto = page.getByTestId('produto-form');
    this.nomeProduto = page.getByTestId('produto-nome-input');
    this.descricaoProduto = page.getByTestId('produto-descricao-input');
    this.precoProduto = page.getByTestId('produto-preco-input');
    this.categoriaProduto = page.getByTestId('produto-categoria-select');
    this.botaoSalvar = page.getByTestId('produto-salvar-button');
    this.filtroTodas = page.getByTestId('filtro-todas');
    this.modalExclusao = page.getByTestId('produto-excluir-modal');
    this.botaoConfirmarExclusao = page.getByTestId('produto-excluir-confirmar-button');
  }

  async abrir() {
    await this.page.goto('/dashboard/cardapio');
  }

  async validarLista() {
    await expect(this.lista).toBeVisible();
  }

  async abrirCriacao() {
    await this.botaoCriar.click();
    await expect(this.modalProduto).toBeVisible();
  }

  async validarFormulario() {
    await expect(this.formularioProduto).toBeVisible();
  }

  async enviarProdutoIncompleto() {
    await this.botaoSalvar.click();
  }

  async validarErroNome() {
    await expect(this.page.getByTestId('produto-nome-error')).toBeVisible();
  }

  async validarFiltroTodas() {
    await expect(this.filtroTodas).toBeVisible();
  }

  async abrirEdicaoPrimeiroProduto() {
    await this.lista.locator('[data-testid^="produto-editar-button-"]').first().click();
    await expect(this.modalProduto).toBeVisible();
  }

  async criarProduto(produto) {
    await this.abrirCriacao();
    await this.nomeProduto.fill(produto.nome);
    await this.descricaoProduto.fill(produto.descricao);
    await this.precoProduto.fill(produto.preco);
    await this.categoriaProduto.click();
    await this.page.getByRole('option', { name: produto.categoriaNome }).click();
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/produtos') && response.status() === 201),
      this.botaoSalvar.click(),
    ]);
    await expect(this.modalProduto).not.toBeVisible();
  }

  async validarProdutoNoCardapio(produtoId) {
    await expect(this.page.getByTestId(`produto-card-${produtoId}`)).toBeVisible();
  }

  async alternarDisponibilidade(produtoId) {
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes(`/produtos/${produtoId}/toggle-disponivel`) && response.status() === 200),
      this.page.getByTestId(`produto-disponivel-toggle-${produtoId}`).click(),
    ]);
  }

  async excluirProduto(produtoId) {
    await this.page.getByTestId(`produto-excluir-button-${produtoId}`).click();
    await expect(this.modalExclusao).toBeVisible();
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes(`/produtos/${produtoId}`) && response.status() === 204),
      this.botaoConfirmarExclusao.click(),
    ]);
    await expect(this.modalExclusao).not.toBeVisible();
  }
}
