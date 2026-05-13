import { expect } from '@playwright/test';

export class ConfiguracoesPage {
  constructor(page) {
    this.page = page;
    this.switchAberta = page.getByTestId('loja-aberta-switch');
    this.formDados = page.getByTestId('dados-loja-form');
    this.botaoSalvarDados = page.getByTestId('salvar-dados-button');
    this.formHorarios = page.getByTestId('horarios-form');
    this.botaoSalvarHorarios = page.getByTestId('salvar-horarios-button');
    this.listaTaxas = page.getByTestId('taxas-list');
    this.botaoAdicionarTaxa = page.getByTestId('adicionar-taxa-button');
  }

  async abrir() {
    await this.page.goto('/dashboard/configuracoes');
  }

  async validarSecoes() {
    await expect(this.switchAberta).toBeVisible();
    await expect(this.formDados).toBeVisible();
    await expect(this.formHorarios).toBeVisible();
    await expect(this.listaTaxas).toBeVisible();
  }

  async alternarLoja() {
    await this.switchAberta.click();
  }

  async salvarDados() {
    await this.botaoSalvarDados.click();
  }

  async salvarHorarios() {
    await this.botaoSalvarHorarios.click();
  }

  async validarBotaoAdicionarTaxa() {
    await expect(this.botaoAdicionarTaxa).toBeVisible();
  }
}
