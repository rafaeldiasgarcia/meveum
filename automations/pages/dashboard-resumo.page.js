import { expect } from '@playwright/test';

export class DashboardResumoPage {
  constructor(page) {
    this.page = page;
    this.cards = [
      page.getByTestId('metric-card-orders-today'),
      page.getByTestId('metric-card-revenue'),
      page.getByTestId('metric-card-ticket'),
      page.getByTestId('metric-card-preparing'),
      page.getByTestId('metric-card-new-clients'),
      page.getByTestId('metric-card-repurchase'),
    ];
    this.grafico = page.getByTestId('grafico-vendas');
    this.pedidosRecentes = page.getByTestId('pedidos-recentes-list');
    this.botaoVerTodos = page.getByTestId('ver-todos-pedidos-button');
  }

  async abrir() {
    await this.page.goto('/dashboard');
  }

  async validarCardsEGrafico() {
    for (const card of this.cards) {
      await expect(card).toBeVisible();
    }
    await expect(this.grafico).toBeVisible();
  }

  async validarPedidosRecentes() {
    await expect(this.pedidosRecentes).toBeVisible();
  }

  async navegarParaPedidos() {
    await this.botaoVerTodos.click();
    await this.page.waitForURL('**/dashboard/pedidos');
  }
}
