package br.com.meveum.crm.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarClienteRequest(
    @NotBlank @Size(max = 120) String nome,
    @NotBlank @Size(max = 20) String telefone
) {
}
