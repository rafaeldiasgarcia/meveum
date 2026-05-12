package br.com.meveum.crm.clientes.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record CriarClienteResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String telefone,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
