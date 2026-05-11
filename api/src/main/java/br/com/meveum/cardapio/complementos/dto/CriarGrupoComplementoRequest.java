package br.com.meveum.cardapio.complementos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CriarGrupoComplementoRequest(
    @NotNull
    UUID lojaId,

    @NotBlank
    @Size(max = 120)
    String nome,

    @Size(max = 500)
    String descricao,

    @NotNull
    @PositiveOrZero
    Integer quantidadeMinima,

    @NotNull
    @PositiveOrZero
    Integer quantidadeMaxima,

    @PositiveOrZero
    Integer ordem
) {
}
