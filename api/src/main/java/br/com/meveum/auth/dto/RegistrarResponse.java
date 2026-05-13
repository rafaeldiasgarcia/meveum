package br.com.meveum.auth.dto;

import lombok.Builder;

@Builder
public record RegistrarResponse(
    String token,
    LoginResponse.UsuarioAutenticadoResponse usuario
) {
}
