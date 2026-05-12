package br.com.meveum.entrega.areas.dto;

import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarAreaEntregaResponse(
    UUID id,
    UUID lojaId,
    String nome,
    TipoAreaEntrega tipo,
    BigDecimal taxa,
    BigDecimal pedidoMinimo,
    Integer tempoEstimadoMinutos,
    Boolean ativo
) {
}
