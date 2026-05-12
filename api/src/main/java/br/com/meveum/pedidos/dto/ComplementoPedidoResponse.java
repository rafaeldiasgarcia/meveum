package br.com.meveum.pedidos.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ComplementoPedidoResponse(
    UUID id,
    UUID grupoComplementoId,
    String nomeGrupoComplemento,
    UUID opcaoComplementoId,
    String nomeOpcaoComplemento,
    BigDecimal precoUnitario,
    Integer quantidade,
    BigDecimal total
) {
}
