import { expect } from '@playwright/test';

export class DashboardResumoPage {
  constructor(page) {
    this.page = page;
    this.cards = [
      page.getByTestId('metric-card-orders-today'),
      page.getByTestId('metric-card-revenue'),
      page.getByTestId('metric-card-ticket'),
      page.getByTestId('metric-card-kitchen-time'),
    ];
    this.grafico = page.getByTestId('grafico-vendas');
    this.pedidosRecentes = page.getByTestId('pedidos-recentes-list');
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
}
