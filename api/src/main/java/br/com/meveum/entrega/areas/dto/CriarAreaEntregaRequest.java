package br.com.meveum.entrega.areas.dto;

import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record CriarAreaEntregaRequest(
    @NotNull
    UUID lojaId,

    @NotBlank
    @Size(max = 120)
    String nome,

    @NotNull
    TipoAreaEntrega tipo,

    @Size(max = 120)
    String bairro,

    @Size(max = 12)
    String cepInicial,

    @Size(max = 12)
    String cepFinal,

    @Positive
    BigDecimal raioKm,

    @NotNull
    @PositiveOrZero
    BigDecimal taxa,

    @PositiveOrZero
    BigDecimal pedidoMinimo,

    @Positive
    Integer tempoEstimadoMinutos
) {
}
