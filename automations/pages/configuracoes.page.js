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
    this.nome = page.getByTestId('loja-nome-input');
    this.telefone = page.getByTestId('loja-telefone-input');
    this.whatsapp = page.getByTestId('loja-whatsapp-input');
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
    const resposta = await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/pausa-manual') && response.status() === 200),
      this.switchAberta.click(),
    ]);
    return resposta[0].json();
  }

  async atualizarDados(configuracao) {
    await this.nome.fill(configuracao.nome);
    await this.telefone.fill(configuracao.telefone);
    await this.whatsapp.fill(configuracao.whatsapp);
    await this.salvarDados();
  }

  async salvarDados() {
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/lojas/') && response.request().method() === 'PUT' && response.status() === 200),
      this.botaoSalvarDados.click(),
    ]);
  }

  async atualizarHorario(configuracao) {
    await this.page.getByTestId(`horario-${configuracao.diaSemana}-abertura`).fill(configuracao.abertura);
    await this.page.getByTestId(`horario-${configuracao.diaSemana}-fechamento`).fill(configuracao.fechamento);
    await this.salvarHorarios();
  }

  async salvarHorarios() {
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/horarios') && response.request().method() === 'PUT' && response.status() === 200),
      this.botaoSalvarHorarios.click(),
    ]);
  }

  async adicionarTaxa() {
    const resposta = await Promise.all([
      this.page.waitForResponse((response) => response.url().includes('/entrega/areas') && response.request().method() === 'POST' && response.status() === 201),
      this.botaoAdicionarTaxa.click(),
    ]);
    return resposta[0].json();
  }

  async removerTaxa(taxaId) {
    await Promise.all([
      this.page.waitForResponse((response) => response.url().includes(`/entrega/areas/${taxaId}`) && response.request().method() === 'DELETE'),
      this.page.getByTestId(`taxa-remover-${taxaId}`).click(),
    ]);
  }

  async validarBotaoAdicionarTaxa() {
    await expect(this.botaoAdicionarTaxa).toBeVisible();
  }
}
