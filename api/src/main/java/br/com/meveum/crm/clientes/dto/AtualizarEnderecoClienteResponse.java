package br.com.meveum.crm.clientes.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarEnderecoClienteResponse(
    UUID id,
    UUID clienteId,
    String rotulo,
    String rua,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String estado,
    String cep,
    String referencia,
    BigDecimal latitude,
    BigDecimal longitude
) {
}
