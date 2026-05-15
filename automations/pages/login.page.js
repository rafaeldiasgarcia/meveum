import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.getByTestId('login-form');
    this.email = page.getByTestId('email-input');
    this.senha = page.getByTestId('password-input');
    this.botaoEntrar = page.getByTestId('submit-login-button');
    this.erroEmail = page.getByTestId('email-error');
    this.erroSenha = page.getByTestId('password-error');
  }

  async abrir() {
    await this.page.goto('/login');
    await expect(this.formulario).toBeVisible();
  }

  async autenticar(payload) {
    await this.email.fill(payload.email);
    await this.senha.fill(payload.senha);
    await this.botaoEntrar.click();
    await this.page.waitForURL('**/dashboard');
  }

  async autenticarCadastro(cadastro) {
    await this.autenticar({
      email: cadastro.email,
      senha: cadastro.senha,
    });
  }

  async autenticarComSenha(email, senha) {
    await this.autenticar({ email, senha });
  }

  async enviarSemPreencher() {
    await this.botaoEntrar.click();
  }

  async validarErrosObrigatorios() {
    await expect(this.erroEmail).toBeVisible();
    await expect(this.erroSenha).toBeVisible();
  }
}
