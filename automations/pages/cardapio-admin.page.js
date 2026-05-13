import { expect } from '@playwright/test';

export class CardapioAdminPage {
  constructor(page) {
    this.page = page;
    this.lista = page.getByTestId('produtos-list');
    this.botaoCriar = page.getByTestId('produto-criar-button');
    this.modalProduto = page.getByTestId('produto-modal');
    this.formularioProduto = page.getByTestId('produto-form');
    this.nomeProduto = page.getByTestId('produto-nome-input');
    this.precoProduto = page.getByTestId('produto-preco-input');
    this.botaoSalvar = page.getByTestId('produto-salvar-button');
    this.filtroTodas = page.getByTestId('filtro-todas');
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
}
