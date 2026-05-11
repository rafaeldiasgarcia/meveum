package br.com.meveum.lojas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarLojaRequest(
    @NotBlank
    @Size(max = 120)
    String nome,

    @NotBlank
    @Size(max = 80)
    String slug,

    @Size(max = 500)
    String logoUrl,

    @NotBlank
    @Size(max = 20)
    String whatsappNumber
) {
}
