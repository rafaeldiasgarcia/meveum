package br.com.meveum.pedidos.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ItemPedidoResponse(
    UUID id,
    UUID produtoId,
    String nomeProduto,
    BigDecimal precoUnitario,
    Integer quantidade,
    BigDecimal total,
    String observacao,
    List<ComplementoPedidoResponse> complementos
) {
}
