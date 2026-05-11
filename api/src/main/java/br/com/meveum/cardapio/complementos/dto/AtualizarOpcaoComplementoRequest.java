package br.com.meveum.cardapio.complementos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AtualizarOpcaoComplementoRequest(
    @NotBlank
    @Size(max = 120)
    String nome,

    @Size(max = 500)
    String descricao,

    @NotNull
    @PositiveOrZero
    BigDecimal precoAdicional,

    @PositiveOrZero
    Integer ordem,

    Boolean ativo
) {
}
