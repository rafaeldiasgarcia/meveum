import { test } from '../../../fixtures/frontend.fixture.js';

test.describe('gestao visual de clientes', () => {
  test.beforeEach(async ({ clientesPage, clienteComEndereco, sessaoUsuarioLogadoNoBrowser }) => {
    await clientesPage.abrir();
  });

  test('lista clientes e mostra detalhe ao selecionar um item', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
    clientesPage,
  }) => {
    await clientesPage.validarLista();
    await clientesPage.abrirPrimeiroCliente();
    await clientesPage.validarDetalhe();
  });

  test('mostra estado vazio ao buscar cliente inexistente', { tag: ['@frontend', '@regressao', '@contrato'] }, async ({
    buscaClienteInexistente,
    clientesPage,
  }) => {
    await clientesPage.buscar(buscaClienteInexistente);
    await clientesPage.validarEstadoVazio();
  });
});
