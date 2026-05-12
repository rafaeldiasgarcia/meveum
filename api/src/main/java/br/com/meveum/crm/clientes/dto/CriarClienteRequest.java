package br.com.meveum.crm.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CriarClienteRequest(
    @NotNull UUID lojaId,
    @NotBlank @Size(max = 120) String nome,
    @NotBlank @Size(max = 20) String telefone
) {
}
