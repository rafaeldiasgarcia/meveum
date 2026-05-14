import { request as requestFactory, test as base } from '@playwright/test';
import { AuthService } from '../services/auth.service.js';
import { LojasService } from '../services/lojas.service.js';
import { CategoriasService } from '../services/categorias.service.js';
import { ProdutosService } from '../services/produtos.service.js';
import { ComplementosService } from '../services/complementos.service.js';
import { ClientesService } from '../services/clientes.service.js';
import { AreasEntregaService } from '../services/areas-entrega.service.js';
import { FormasPagamentoService } from '../services/formas-pagamento.service.js';
import { PedidosService } from '../services/pedidos.service.js';
import { DashboardService } from '../services/dashboard.service.js';
import { WhatsappService } from '../services/whatsapp.service.js';
import {
  criarCatalogoCompletoPreset,
  criarClienteComEnderecoPreset,
  criarDashboardComMovimentoPreset,
  criarLojaAtualizavelPreset,
  criarPedidoDeliveryPreset,
  criarPedidoPickupPreset,
  criarUsuarioLogadoPreset,
  periodoDashboard as periodoDashboardPreset,
} from '../presets/api.presets.js';
import {
  criarRedefinicaoSenha,
  criarSolicitacaoRecuperacaoSenha,
  redefinicaoSenhaTokenInvalido,
  solicitacaoRecuperacaoSenhaInvalida,
} from '../data/auth.data.js';
import { criarCategoriaPayload } from '../data/catalogo.data.js';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:8080';

export const test = base.extend({
  apiRequest: async ({}, use) => {
    const contexto = await requestFactory.newContext({ baseURL: API_BASE_URL });
    await use(contexto);
    await contexto.dispose();
  },
  authService: async ({ apiRequest }, use) => {
    await use(new AuthService(apiRequest));
  },
  lojasService: async ({ apiRequest }, use) => {
    await use(new LojasService(apiRequest));
  },
  categoriasService: async ({ apiRequest }, use) => {
    await use(new CategoriasService(apiRequest));
  },
  produtosService: async ({ apiRequest }, use) => {
    await use(new ProdutosService(apiRequest));
  },
  complementosService: async ({ apiRequest }, use) => {
    await use(new ComplementosService(apiRequest));
  },
  clientesService: async ({ apiRequest }, use) => {
    await use(new ClientesService(apiRequest));
  },
  areasEntregaService: async ({ apiRequest }, use) => {
    await use(new AreasEntregaService(apiRequest));
  },
  formasPagamentoService: async ({ apiRequest }, use) => {
    await use(new FormasPagamentoService(apiRequest));
  },
  pedidosService: async ({ apiRequest }, use) => {
    await use(new PedidosService(apiRequest));
  },
  dashboardService: async ({ apiRequest }, use) => {
    await use(new DashboardService(apiRequest));
  },
  whatsappService: async ({ apiRequest }, use) => {
    await use(new WhatsappService(apiRequest));
  },
  usuarioLogado: async ({ authService }, use) => {
    await use(await criarUsuarioLogadoPreset(authService, 'Usuario Principal'));
  },
  segundoUsuarioLogado: async ({ authService }, use) => {
    await use(await criarUsuarioLogadoPreset(authService, 'Usuario Secundario'));
  },
  lojaAtualizavel: async ({ lojasService, usuarioLogado }, use) => {
    await use(await criarLojaAtualizavelPreset(lojasService, usuarioLogado));
  },
  catalogoCompleto: async ({
    categoriasService,
    produtosService,
    complementosService,
    formasPagamentoService,
    areasEntregaService,
    usuarioLogado,
  }, use) => {
    await use(
      await criarCatalogoCompletoPreset({
        categoriasService,
        produtosService,
        complementosService,
        formasPagamentoService,
        areasEntregaService,
        usuarioLogado,
      })
    );
  },
  categoriaDescartavel: async ({ categoriasService, usuarioLogado }, use) => {
    await use(
      await categoriasService.validarCriacao(
        criarCategoriaPayload(usuarioLogado.lojaId),
        usuarioLogado.token
      )
    );
  },
  recuperacaoSenhaValida: async ({ authService, usuarioLogado }, use) => {
    const recuperacao = await authService.validarSolicitacaoRecuperacaoSenha(
      criarSolicitacaoRecuperacaoSenha(usuarioLogado.cadastro.email)
    );

    await use(criarRedefinicaoSenha(recuperacao.token));
  },
  solicitacaoRecuperacaoSenhaInvalida: async ({}, use) => {
    await use(solicitacaoRecuperacaoSenhaInvalida);
  },
  redefinicaoSenhaTokenInvalido: async ({}, use) => {
    await use(redefinicaoSenhaTokenInvalido);
  },
  clienteComEndereco: async ({ clientesService, usuarioLogado }, use) => {
    await use(await criarClienteComEnderecoPreset(clientesService, usuarioLogado));
  },
  pedidoPickup: async ({ pedidosService, usuarioLogado, catalogoCompleto, clienteComEndereco }, use) => {
    await use(
      await criarPedidoPickupPreset(
        pedidosService,
        usuarioLogado,
        catalogoCompleto,
        clienteComEndereco
      )
    );
  },
  pedidoDelivery: async ({ pedidosService, usuarioLogado, catalogoCompleto, clienteComEndereco }, use) => {
    await use(
      await criarPedidoDeliveryPreset(
        pedidosService,
        usuarioLogado,
        catalogoCompleto,
        clienteComEndereco
      )
    );
  },
  dashboardComMovimento: async ({
    pedidosService,
    usuarioLogado,
    catalogoCompleto,
    clienteComEndereco,
  }, use) => {
    await use(
      await criarDashboardComMovimentoPreset(
        pedidosService,
        usuarioLogado,
        catalogoCompleto,
        clienteComEndereco
      )
    );
  },
  periodoDashboard: async ({}, use) => {
    await use(periodoDashboardPreset);
  },
});
