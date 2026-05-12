package br.com.meveum.dashboard.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarProdutoMaisVendidoResponse(
    UUID produtoId,
    String nomeProduto,
    Long quantidadeVendida,
    BigDecimal faturamento
) {
}
