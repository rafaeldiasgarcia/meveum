package br.com.meveum.dashboard.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record PedidoResumoDashboardResponse(
    UUID id,
    Integer numero,
    String descricao,
    String nomeCliente,
    String local,
    String status,
    String tempoStr,
    BigDecimal total,
    String formaPagamento
) {
}
