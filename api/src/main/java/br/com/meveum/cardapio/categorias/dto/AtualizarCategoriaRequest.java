package br.com.meveum.cardapio.categorias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record AtualizarCategoriaRequest(
    @NotBlank
    @Size(max = 120)
    String nome,

    @Size(max = 500)
    String descricao,

    @PositiveOrZero
    Integer ordem,

    Boolean ativo
) {
}
