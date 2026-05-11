package br.com.meveum.cardapio.categorias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CriarCategoriaRequest(
    @NotNull
    UUID lojaId,

    @NotBlank
    @Size(max = 120)
    String nome,

    @Size(max = 500)
    String descricao,

    @PositiveOrZero
    Integer ordem
) {
}
