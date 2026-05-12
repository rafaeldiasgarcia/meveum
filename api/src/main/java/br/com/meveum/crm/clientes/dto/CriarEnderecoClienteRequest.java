package br.com.meveum.crm.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CriarEnderecoClienteRequest(
    @Size(max = 80) String rotulo,
    @NotBlank @Size(max = 160) String rua,
    @NotBlank @Size(max = 30) String numero,
    @Size(max = 120) String complemento,
    @NotBlank @Size(max = 120) String bairro,
    @NotBlank @Size(max = 120) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    @Size(max = 12) String cep,
    @Size(max = 255) String referencia,
    BigDecimal latitude,
    BigDecimal longitude
) {
}
