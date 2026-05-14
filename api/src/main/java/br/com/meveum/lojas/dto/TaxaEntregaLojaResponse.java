package br.com.meveum.lojas.dto;

import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record TaxaEntregaLojaResponse(
    UUID id,
    String nome,
    TipoAreaEntrega tipo,
    String bairro,
    String cepInicial,
    String cepFinal,
    BigDecimal raioKm,
    BigDecimal taxa,
    BigDecimal pedidoMinimo,
    Integer tempoEstimadoMinutos,
    Integer tempoMin,
    Boolean ativo
) {
}
