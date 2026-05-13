import { test } from '../../../fixtures/api.fixture.js';

test('cria lista detalha e atualiza cliente da loja', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  clientesService,
  clienteComEndereco,
  usuarioLogado,
}) => {
  await clientesService.validarListagem(usuarioLogado.lojaId, clienteComEndereco.cliente);
  await clientesService.validarDetalhe(
    clienteComEndereco.cliente.id,
    clienteComEndereco.cliente,
    usuarioLogado.token
  );
  await clientesService.validarAtualizacao(
    clienteComEndereco.cliente.id,
    clienteComEndereco.clienteAtualizado,
    usuarioLogado.token
  );
});

test('gerencia endereco do cliente', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  clientesService,
  clienteComEndereco,
  usuarioLogado,
}) => {
  await clientesService.validarListagemEnderecos(
    clienteComEndereco.cliente.id,
    clienteComEndereco.endereco,
    usuarioLogado.token
  );
  await clientesService.validarDetalheEndereco(
    clienteComEndereco.cliente.id,
    clienteComEndereco.endereco.id,
    clienteComEndereco.endereco,
    usuarioLogado.token
  );
  await clientesService.validarAtualizacaoEndereco(
    clienteComEndereco.cliente.id,
    clienteComEndereco.endereco.id,
    clienteComEndereco.enderecoAtualizado,
    usuarioLogado.token
  );
  await clientesService.validarExclusaoEndereco(
    clienteComEndereco.cliente.id,
    clienteComEndereco.endereco.id,
    usuarioLogado.token
  );
});

test('rejeita telefone duplicado na mesma loja', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  clientesService,
  clienteComEndereco,
}) => {
  await clientesService.validarDuplicidade(clienteComEndereco.clientePayload);
});

test('rejeita endereco invalido', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  clientesService,
  clienteComEndereco,
}) => {
  await clientesService.validarEnderecoInvalido(
    clienteComEndereco.cliente.id,
    clienteComEndereco.enderecoInvalido
  );
});
