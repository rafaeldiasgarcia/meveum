package br.com.meveum.cardapio.complementos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.UUID;

public record VincularGrupoComplementoProdutoRequest(
    @NotNull
    UUID grupoComplementoId,

    @PositiveOrZero
    Integer ordem
) {
}
