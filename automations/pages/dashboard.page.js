import { expect } from '@playwright/test';

export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.topbar = page.getByTestId('topbar');
    this.nomeUsuario = page.getByTestId('user-menu-name');
    this.saudacao = page.getByTestId('dashboard-greeting');
    this.botaoSair = page.getByTestId('logout-button');
  }

  async abrir() {
    await this.page.goto('/dashboard');
  }

  async validarUsuarioExibido(nome) {
    await expect(this.topbar).toBeVisible();
    await expect(this.nomeUsuario).toHaveText(nome);
    await expect(this.saudacao).toContainText(nome);
  }

  async validarRedirecionamentoParaLogin() {
    await this.page.waitForURL('**/login');
    await expect(this.page.getByTestId('login-form')).toBeVisible();
  }

  async sair() {
    await this.botaoSair.click();
    await this.validarRedirecionamentoParaLogin();
  }
}
