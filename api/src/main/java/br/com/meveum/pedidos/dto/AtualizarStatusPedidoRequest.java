package br.com.meveum.pedidos.dto;

import br.com.meveum.pedidos.entity.enums.StatusPedido;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusPedidoRequest(
    @NotNull StatusPedido status
) {
}
