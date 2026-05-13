package br.com.meveum.auth.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record LoginResponse(
    String token,
    UsuarioAutenticadoResponse usuario
) {

    @Builder
    public record UsuarioAutenticadoResponse(
        UUID id,
        UUID lojaId,
        String nome,
        String email,
        String role
    ) {
    }
}
