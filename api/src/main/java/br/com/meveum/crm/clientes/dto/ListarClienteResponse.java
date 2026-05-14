package br.com.meveum.crm.clientes.dto;

import java.util.UUID;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Builder;

@Builder
public record ListarClienteResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String telefone,
    Long totalPedidos,
    BigDecimal totalGasto,
    OffsetDateTime ultimoPedido,
    OffsetDateTime criadoEm
) {
}
