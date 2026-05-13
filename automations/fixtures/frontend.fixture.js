import { test as apiTest } from './api.fixture.js';
import { LoginPage } from '../pages/login.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { LandingPage } from '../pages/landing.page.js';
import { DashboardResumoPage } from '../pages/dashboard-resumo.page.js';
import { PedidosPage } from '../pages/pedidos.page.js';
import { ClientesPage } from '../pages/clientes.page.js';
import { CardapioAdminPage } from '../pages/cardapio-admin.page.js';
import { ConfiguracoesPage } from '../pages/configuracoes.page.js';
import { CardapioPublicoPage } from '../pages/cardapio-publico.page.js';
import { SessaoBrowserService } from '../services/sessao-browser.service.js';
import { criarCadastroUsuario } from '../data/auth.data.js';
import { buscaClienteSemResultado, buscaSemResultado } from '../data/frontend.data.js';

export const test = apiTest.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  dashboardResumoPage: async ({ page }, use) => {
    await use(new DashboardResumoPage(page));
  },
  pedidosPage: async ({ page }, use) => {
    await use(new PedidosPage(page));
  },
  clientesPage: async ({ page }, use) => {
    await use(new ClientesPage(page));
  },
  cardapioAdminPage: async ({ page }, use) => {
    await use(new CardapioAdminPage(page));
  },
  configuracoesPage: async ({ page }, use) => {
    await use(new ConfiguracoesPage(page));
  },
  cardapioPublicoPage: async ({ page }, use) => {
    await use(new CardapioPublicoPage(page));
  },
  sessaoBrowserService: async ({ page }, use) => {
    await use(new SessaoBrowserService(page));
  },
  novoCadastroFrontend: async ({}, use) => {
    await use(criarCadastroUsuario('Cadastro Frontend'));
  },
  sessaoUsuarioLogadoNoBrowser: async ({ sessaoBrowserService, usuarioLogado }, use) => {
    await sessaoBrowserService.definirSessao({
      token: usuarioLogado.token,
      usuario: usuarioLogado.usuario,
    });

    await use({
      token: usuarioLogado.token,
      usuario: usuarioLogado.usuario,
    });
  },
  sessaoSegundoUsuarioNoBrowser: async ({ sessaoBrowserService, segundoUsuarioLogado }, use) => {
    await sessaoBrowserService.definirSessao({
      token: segundoUsuarioLogado.token,
      usuario: segundoUsuarioLogado.usuario,
    });

    await use({
      token: segundoUsuarioLogado.token,
      usuario: segundoUsuarioLogado.usuario,
    });
  },
  cardapioPublicoDinamico: async ({ lojaAtualizavel, catalogoCompleto }, use) => {
    await use({
      slug: lojaAtualizavel.loja.slug,
      lojaNome: lojaAtualizavel.loja.nome,
      categoriaId: catalogoCompleto.categoria.id,
      categoriaNome: catalogoCompleto.categoria.nome,
      produtoId: catalogoCompleto.produto.id,
      produtoNome: catalogoCompleto.produto.nome,
      buscaSemResultado,
    });
  },
  buscaClienteInexistente: async ({}, use) => {
    await use(buscaClienteSemResultado);
  },
});
