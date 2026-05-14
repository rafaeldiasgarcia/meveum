import { expect } from '@playwright/test';

export class PedidosPage {
  constructor(page) {
    this.page = page;
    this.lista = page.getByTestId('pedidos-list');
    this.detalhe = page.getByTestId('pedido-detalhe');
    this.itens = page.getByTestId('pedido-itens');
    this.filtroStatus = page.getByTestId('pedido-status-filter');
    this.botaoAvancar = page.getByTestId('pedido-avancar-status-button');
    this.botaoCancelar = page.getByTestId('pedido-cancelar-button');
  }

  async abrir() {
    await this.page.goto('/dashboard/pedidos');
  }

  async validarLista() {
    await expect(this.lista).toBeVisible();
  }

  async abrirPrimeiroPedido() {
    await this.lista.locator('button').first().click();
  }

  async abrirPedido(pedidoId) {
    await this.page.getByTestId(`pedido-card-${pedidoId}`).click();
    await this.validarDetalhe();
  }

  async validarDetalhe() {
    await expect(this.detalhe).toBeVisible();
    await expect(this.itens).toBeVisible();
  }

  async avancarStatusQuandoDisponivel() {
    await expect(this.botaoAvancar).toBeVisible();
    await this.botaoAvancar.click();
  }

  async avancarStatusPedido(pedidoId) {
    await this.abrirPedido(pedidoId);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes(`/pedidos/${pedidoId}/status`) && response.status() === 200),
      this.avancarStatusQuandoDisponivel(),
    ]);
  }

  async cancelarQuandoDisponivel() {
    await expect(this.botaoCancelar).toBeVisible();
    await this.botaoCancelar.click();
  }
}
