import {
  cadastroInvalido,
  criarCadastroDuplicado,
  criarCadastroUsuario,
  criarCredenciaisInvalidas,
} from '../data/auth.data.js';
import {
  atualizarCategoriaPayload,
  atualizarGrupoComplementoPayload,
  atualizarOpcaoComplementoPayload,
  atualizarProdutoPayload,
  criarCategoriaPayload,
  criarGrupoComplementoPayload,
  criarOpcaoComplementoPayload,
  criarProdutoPayload,
  vincularGrupoProdutoPayload,
} from '../data/catalogo.data.js';
import {
  atualizarClientePayload,
  atualizarEnderecoPayload,
  criarClientePayload,
  criarEnderecoInvalido,
  criarEnderecoPayload,
} from '../data/clientes.data.js';
import {
  atualizarAreaEntregaBairroPayload,
  criarAreaEntregaBairroPayload,
  criarAreaEntregaRaioInvalida,
} from '../data/entrega.data.js';
import {
  atualizarFormaPagamentoPayload,
  criarFormaPagamentoPayload,
} from '../data/pagamentos.data.js';
import {
  criarAtualizacaoStatusPedido,
  criarPedidoDeliveryInvalido,
  criarPedidoDeliveryPayload,
  criarPedidoPickupPayload,
} from '../data/pedidos.data.js';
import {
  atualizarLojaPayload,
  atualizarPausaManualPayload,
  atualizarStatusLojaPayload,
} from '../data/lojas.data.js';

export async function criarUsuarioLogadoPreset(authService, prefixo = 'Usuario Automacao') {
  const cadastro = criarCadastroUsuario(prefixo);
  const registro = await authService.validarRegistro(cadastro);
  const loginPayload = {
    email: cadastro.email,
    senha: cadastro.senha,
  };
  const sessao = await authService.validarLogin(loginPayload, registro.usuario);

  return {
    cadastro,
    registro,
    loginPayload,
    sessao,
    usuario: sessao.usuario,
    lojaId: sessao.usuario.lojaId,
    token: sessao.token,
    loginInvalido: criarCredenciaisInvalidas(cadastro.email),
    cadastroDuplicado: criarCadastroDuplicado(cadastro),
    cadastroInvalido,
  };
}

export async function criarLojaAtualizavelPreset(lojasService, usuarioLogado) {
  const loja = await lojasService.obterDetalhesPrivados(
    usuarioLogado.lojaId,
    usuarioLogado.token
  );

  return {
    loja,
    atualizar: atualizarLojaPayload(loja),
    pausar: atualizarPausaManualPayload(true),
    reativar: atualizarPausaManualPayload(false),
    inativar: atualizarStatusLojaPayload('INACTIVE'),
    ativar: atualizarStatusLojaPayload('ACTIVE'),
  };
}

export async function criarCatalogoCompletoPreset({
  categoriasService,
  produtosService,
  complementosService,
  formasPagamentoService,
  areasEntregaService,
  usuarioLogado,
}) {
  const categoriaPayload = criarCategoriaPayload(usuarioLogado.lojaId);
  const categoria = await categoriasService.validarCriacao(categoriaPayload, usuarioLogado.token);
  const produtoPayload = criarProdutoPayload(usuarioLogado.lojaId, categoria.id);
  const produto = await produtosService.validarCriacao(produtoPayload, usuarioLogado.token);
  const grupoPayload = criarGrupoComplementoPayload(usuarioLogado.lojaId);
  const grupo = await complementosService.validarCriacaoGrupo(grupoPayload, usuarioLogado.token);
  const opcaoPayload = criarOpcaoComplementoPayload(usuarioLogado.lojaId, grupo.id);
  const opcao = await complementosService.validarCriacaoOpcao(opcaoPayload, usuarioLogado.token);
  const vinculoPayload = vincularGrupoProdutoPayload(grupo.id);
  const vinculo = await complementosService.validarVinculoProduto(
    produto.id,
    vinculoPayload,
    usuarioLogado.token
  );
  const formaPagamentoPayload = criarFormaPagamentoPayload(usuarioLogado.lojaId);
  const formaPagamento = await formasPagamentoService.validarCriacao(
    formaPagamentoPayload,
    usuarioLogado.token
  );
  const areaEntregaPayload = criarAreaEntregaBairroPayload(usuarioLogado.lojaId);
  const areaEntrega = await areasEntregaService.validarCriacao(
    areaEntregaPayload,
    usuarioLogado.token
  );

  return {
    categoria,
    categoriaPayload,
    categoriaAtualizada: atualizarCategoriaPayload(categoria),
    produto,
    produtoPayload,
    produtoAtualizado: atualizarProdutoPayload(produto),
    grupo,
    grupoPayload,
    grupoAtualizado: atualizarGrupoComplementoPayload(grupo),
    opcao,
    opcaoPayload,
    opcaoAtualizada: atualizarOpcaoComplementoPayload(opcao),
    vinculo,
    vinculoPayload,
    formaPagamento,
    formaPagamentoPayload,
    formaPagamentoInativa: atualizarFormaPagamentoPayload(
      formaPagamento.formaPagamento,
      false
    ),
    formaPagamentoAtiva: atualizarFormaPagamentoPayload(
      formaPagamento.formaPagamento,
      true
    ),
    areaEntrega,
    areaEntregaPayload,
    areaEntregaAtualizada: atualizarAreaEntregaBairroPayload(areaEntrega),
    areaEntregaInvalida: criarAreaEntregaRaioInvalida(usuarioLogado.lojaId),
  };
}

export async function criarClienteComEnderecoPreset(clientesService, usuarioLogado) {
  const clientePayload = criarClientePayload(usuarioLogado.lojaId);
  const cliente = await clientesService.validarCriacao(clientePayload);
  const enderecoPayload = criarEnderecoPayload();
  const endereco = await clientesService.validarCriacaoEndereco(cliente.id, enderecoPayload);

  return {
    cliente,
    clientePayload,
    clienteAtualizado: atualizarClientePayload(cliente),
    endereco,
    enderecoPayload,
    enderecoAtualizado: atualizarEnderecoPayload(endereco),
    enderecoInvalido: criarEnderecoInvalido(),
  };
}

export async function criarPedidoPickupPreset(pedidosService, usuarioLogado, catalogoCompleto, clienteComEndereco) {
  const payload = criarPedidoPickupPayload({
    lojaId: usuarioLogado.lojaId,
    cliente: clienteComEndereco?.cliente,
    produto: catalogoCompleto.produto,
    opcaoComplemento: catalogoCompleto.opcao,
  });
  const pedido = await pedidosService.validarCriacao(payload);

  return {
    payload,
    pedido,
    proximoStatus: criarAtualizacaoStatusPedido('PREPARING'),
  };
}

export async function criarPedidoDeliveryPreset(pedidosService, usuarioLogado, catalogoCompleto, clienteComEndereco) {
  const payload = criarPedidoDeliveryPayload({
    lojaId: usuarioLogado.lojaId,
    cliente: clienteComEndereco.cliente,
    endereco: clienteComEndereco.endereco,
    areaEntrega: catalogoCompleto.areaEntrega,
    produto: catalogoCompleto.produto,
  });
  const pedido = await pedidosService.validarCriacao(payload);

  return {
    payload,
    pedido,
    invalido: criarPedidoDeliveryInvalido({
      lojaId: usuarioLogado.lojaId,
      produto: catalogoCompleto.produto,
    }),
  };
}

export async function criarDashboardComMovimentoPreset(pedidosService, usuarioLogado, catalogoCompleto, clienteComEndereco) {
  return criarPedidoPickupPreset(
    pedidosService,
    usuarioLogado,
    catalogoCompleto,
    clienteComEndereco
  );
}

export const periodoDashboard = Object.freeze({
  inicio: '2000-01-01T00:00:00Z',
  fim: '2100-01-01T00:00:00Z',
});
