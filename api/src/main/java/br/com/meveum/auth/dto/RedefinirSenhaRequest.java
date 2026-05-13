package br.com.meveum.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RedefinirSenhaRequest(
    @NotBlank
    String token,

    @NotBlank
    String senha,

    @NotBlank
    String confirmarSenha
) {
}
