package br.com.meveum.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrarRequest(
    @NotBlank
    String nome,
    @NotBlank
    String nomeLoja,
    @NotBlank
    String telefone,
    @NotBlank
    @Email
    String email,
    @NotBlank
    String senha,
    @NotBlank
    String confirmarSenha
) {
}
