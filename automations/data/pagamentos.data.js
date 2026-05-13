export function criarFormaPagamentoPayload(lojaId, formaPagamento = 'PIX') {
  return {
    lojaId,
    formaPagamento,
  };
}

export function atualizarFormaPagamentoPayload(formaPagamento, ativo) {
  return {
    formaPagamento,
    ativo,
  };
}
