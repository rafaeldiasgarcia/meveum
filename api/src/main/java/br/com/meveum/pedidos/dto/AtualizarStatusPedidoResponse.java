package br.com.meveum.pedidos.dto;

import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarStatusPedidoResponse(
    UUID id,
    UUID lojaId,
    StatusPedido status,
    OffsetDateTime atualizadoEm
) {
}
