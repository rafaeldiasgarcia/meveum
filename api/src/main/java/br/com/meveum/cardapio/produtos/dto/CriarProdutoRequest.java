package br.com.meveum.cardapio.produtos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record CriarProdutoRequest(
    @NotNull
    UUID lojaId,

    @NotNull
    UUID categoriaId,

    @NotBlank
    @Size(max = 140)
    String nome,

    String descricao,

    @NotNull
    @PositiveOrZero
    BigDecimal preco,

    @Size(max = 500)
    String imagemUrl,

    @PositiveOrZero
    Integer ordem
) {
}
