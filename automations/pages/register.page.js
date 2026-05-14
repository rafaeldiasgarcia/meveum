import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.getByTestId('register-form');
    this.nome = page.getByTestId('nome-input');
    this.nomeLoja = page.getByTestId('nome-loja-input');
    this.telefone = page.getByTestId('telefone-input');
    this.email = page.getByTestId('register-email-input');
    this.senha = page.getByTestId('register-password-input');
    this.confirmarSenha = page.getByTestId('confirm-password-input');
    this.aceiteTermos = page.getByTestId('terms-checkbox');
    this.botaoCadastrar = page.getByTestId('submit-register-button');
    this.erroNome = page.getByTestId('nome-error');
    this.erroEmail = page.getByTestId('register-email-error');
    this.erroConfirmacaoSenha = page.getByTestId('confirm-password-error');
  }

  async abrir() {
    await this.page.goto('/register');
    await expect(this.formulario).toBeVisible();
  }

  async cadastrar(payload) {
    await this.nome.fill(payload.nome);
    await this.nomeLoja.fill(payload.nomeLoja);
    await this.telefone.fill(payload.telefone);
    await this.email.fill(payload.email);
    await this.senha.fill(payload.senha);
    await this.confirmarSenha.fill(payload.confirmarSenha);
    await this.aceiteTermos.check();
    await this.botaoCadastrar.click();
    await this.page.waitForURL('**/dashboard');
  }

  async enviarSemPreencher() {
    await this.botaoCadastrar.click();
  }

  async validarErrosObrigatorios() {
    await expect(this.erroNome).toBeVisible();
    await expect(this.erroEmail).toBeVisible();
    await expect(this.erroConfirmacaoSenha).toBeVisible();
  }
}
