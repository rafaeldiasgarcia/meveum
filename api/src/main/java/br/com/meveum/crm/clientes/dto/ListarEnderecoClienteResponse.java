package br.com.meveum.crm.clientes.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarEnderecoClienteResponse(
    UUID id,
    UUID clienteId,
    String rotulo,
    String rua,
    String numero,
    String bairro,
    String cidade,
    String estado,
    String cep
) {
}
