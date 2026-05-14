import { expect } from '@playwright/test';

export class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.getByTestId('reset-password-form');
    this.token = page.getByTestId('reset-password-token-input');
    this.senha = page.getByTestId('reset-password-input');
    this.confirmarSenha = page.getByTestId('reset-password-confirm-input');
    this.botaoSalvar = page.getByTestId('reset-password-submit-button');
  }

  async abrirComToken(token) {
    await this.page.goto(`/redefinir-senha?token=${token}`);
    await expect(this.formulario).toBeVisible();
    await expect(this.token).toHaveValue(token);
  }

  async redefinir(payload) {
    await this.senha.fill(payload.senha);
    await this.confirmarSenha.fill(payload.confirmarSenha);
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/auth/redefinir-senha') && response.status() === 200),
      this.botaoSalvar.click(),
    ]);
  }

  async validarFormularioVisivel() {
    await expect(this.formulario).toBeVisible();
  }
}
