import { expect } from '@playwright/test';

export class ClientesPage {
  constructor(page) {
    this.page = page;
    this.busca = page.getByTestId('clientes-busca-input');
    this.lista = page.getByTestId('clientes-list');
    this.detalhe = page.getByTestId('cliente-detalhe');
    this.estadoVazio = page.getByTestId('clientes-empty-state');
  }

  async abrir() {
    await this.page.goto('/dashboard/clientes');
  }

  async validarLista() {
    await expect(this.lista).toBeVisible();
  }

  async buscar(termo) {
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/clientes') && response.status() === 200),
      this.busca.fill(termo),
    ]);
  }

  async validarEstadoVazio() {
    await expect(this.estadoVazio).toBeVisible();
  }

  async abrirPrimeiroCliente() {
    await this.lista.locator('button').first().click();
  }

  async abrirCliente(clienteId) {
    await this.page.getByTestId(`cliente-card-${clienteId}`).click();
  }

  async validarClienteNaLista(clienteId) {
    await expect(this.page.getByTestId(`cliente-card-${clienteId}`)).toBeVisible();
  }

  async validarDetalhe() {
    await expect(this.detalhe).toBeVisible();
  }
}
