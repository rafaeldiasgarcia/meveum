package br.com.meveum.crm.clientes.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarClienteResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String telefone
) {
}
