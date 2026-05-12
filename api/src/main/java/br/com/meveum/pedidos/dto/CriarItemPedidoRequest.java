package br.com.meveum.pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record CriarItemPedidoRequest(
    @NotNull UUID produtoId,
    @NotNull @Positive Integer quantidade,
    @Size(max = 500) String observacao,
    @Valid List<CriarComplementoPedidoRequest> complementos
) {
}
