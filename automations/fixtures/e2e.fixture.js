import { test as frontendTest } from './frontend.fixture.js';
import { DatabaseService } from '../services/database.service.js';
import { E2EFluxosService } from '../services/e2e-fluxos.service.js';
import {
  criarCadastroE2E,
  criarConfiguracaoLojaE2E,
  criarNovaSenhaE2E,
  criarProdutoAdminE2E,
  criarCheckoutDeliveryE2E,
  criarCheckoutPickupE2E,
} from '../data/e2e.data.js';

export const test = frontendTest.extend({
  dbService: async ({}, use) => {
    const service = new DatabaseService();
    await use(service);
    await service.fechar();
  },
  cadastroE2E: async ({}, use) => {
    await use(criarCadastroE2E());
  },
  produtoAdminE2E: async ({ catalogoCompleto }, use) => {
    await use(criarProdutoAdminE2E(catalogoCompleto.categoria));
  },
  checkoutPickupE2E: async ({}, use) => {
    await use(criarCheckoutPickupE2E());
  },
  checkoutDeliveryE2E: async ({ catalogoCompleto }, use) => {
    await use(criarCheckoutDeliveryE2E(catalogoCompleto.areaEntrega));
  },
  configuracaoLojaE2E: async ({}, use) => {
    await use(criarConfiguracaoLojaE2E());
  },
  redefinicaoSenhaE2E: async ({}, use) => {
    await use(criarNovaSenhaE2E);
  },
  fluxoE2EService: async ({
    cardapioAdminPage,
    cardapioPublicoPage,
    clientesPage,
    configuracoesPage,
    dashboardPage,
    dashboardResumoPage,
    dbService,
    forgotPasswordPage,
    loginPage,
    pedidosPage,
    registerPage,
    resetPasswordPage,
    sessaoBrowserService,
  }, use) => {
    await use(
      new E2EFluxosService({
        cardapioAdminPage,
        cardapioPublicoPage,
        clientesPage,
        configuracoesPage,
        dashboardPage,
        dashboardResumoPage,
        dbService,
        forgotPasswordPage,
        loginPage,
        pedidosPage,
        registerPage,
        resetPasswordPage,
        sessaoBrowserService,
      })
    );
  },
});
