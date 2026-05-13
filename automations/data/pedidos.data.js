export function criarPedidoPickupPayload({ lojaId, cliente, produto, opcaoComplemento }) {
  return {
    lojaId,
    clienteId: cliente?.id ?? null,
    enderecoClienteId: null,
    areaEntregaId: null,
    nomeCliente: cliente?.nome ?? 'Cliente Pickup Automacao',
    telefoneCliente: cliente?.telefone ?? '11998887766',
    tipoRecebimento: 'PICKUP',
    formaPagamento: 'PIX',
    precisaTroco: false,
    trocoPara: null,
    observacaoCliente: 'Pedido pickup criado pela automacao',
    itens: [
      {
        produtoId: produto.id,
        quantidade: 1,
        observacao: 'Sem observacoes adicionais',
        complementos: opcaoComplemento
          ? [
              {
                opcaoComplementoId: opcaoComplemento.id,
                quantidade: 1,
              },
            ]
          : [],
      },
    ],
  };
}

export function criarPedidoDeliveryPayload({ lojaId, cliente, endereco, areaEntrega, produto }) {
  return {
    lojaId,
    clienteId: cliente.id,
    enderecoClienteId: endereco.id,
    areaEntregaId: areaEntrega.id,
    nomeCliente: cliente.nome,
    telefoneCliente: cliente.telefone,
    tipoRecebimento: 'DELIVERY',
    formaPagamento: 'PIX',
    precisaTroco: false,
    trocoPara: null,
    observacaoCliente: 'Pedido delivery criado pela automacao',
    itens: [
      {
        produtoId: produto.id,
        quantidade: 1,
        observacao: 'Entregar na portaria',
        complementos: [],
      },
    ],
  };
}

export function criarAtualizacaoStatusPedido(status) {
  return {
    status,
  };
}

export function criarPedidoDeliveryInvalido({ lojaId, produto }) {
  return {
    lojaId,
    clienteId: null,
    enderecoClienteId: null,
    areaEntregaId: null,
    nomeCliente: 'Cliente Delivery Invalido',
    telefoneCliente: '11995554444',
    tipoRecebimento: 'DELIVERY',
    formaPagamento: 'PIX',
    precisaTroco: false,
    trocoPara: null,
    observacaoCliente: 'Pedido delivery sem endereco',
    itens: [
      {
        produtoId: produto.id,
        quantidade: 1,
        observacao: '',
        complementos: [],
      },
    ],
  };
}
