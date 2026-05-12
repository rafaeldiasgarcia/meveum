package br.com.meveum.pedidos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.UUID;

public record CriarComplementoPedidoRequest(
    @NotNull UUID opcaoComplementoId,
    @NotNull @Positive Integer quantidade
) {
}
