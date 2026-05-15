import { expect } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.getByTestId('forgot-password-form');
    this.email = page.getByTestId('forgot-password-email-input');
    this.botaoEnviar = page.getByTestId('forgot-password-submit-button');
    this.tokenDesenvolvimento = page.getByTestId('forgot-password-dev-token');
  }

  async abrir() {
    await this.page.goto('/esqueci-senha');
    await expect(this.formulario).toBeVisible();
  }

  async solicitar(email) {
    await this.email.fill(email);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/auth/esqueci-senha') && response.status() === 200),
      this.botaoEnviar.click(),
    ]);
  }

  async validarTokenExibido() {
    await expect(this.tokenDesenvolvimento).toBeVisible();
  }

  async solicitarERetornarToken(email) {
    await this.solicitar(email);
    await this.validarTokenExibido();
    return this.tokenDesenvolvimento.locator('p').nth(1).innerText();
  }
}
