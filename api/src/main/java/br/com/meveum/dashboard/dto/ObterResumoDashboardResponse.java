package br.com.meveum.dashboard.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ObterResumoDashboardResponse(
    UUID lojaId,
    BigDecimal faturamentoTotal,
    Long quantidadePedidos,
    BigDecimal ticketMedio,
    Double tempoMedioCozinhaMin,
    Double variacaoPedidos,
    Double variacaoFaturamento,
    Double variacaoTicket,
    Double variacaoTempoCozinha,
    Long pedidosNovos,
    Long pedidosEmPreparo,
    Long pedidosEmEntrega,
    Long pedidosFinalizados,
    Long pedidosCancelados
) {
}
