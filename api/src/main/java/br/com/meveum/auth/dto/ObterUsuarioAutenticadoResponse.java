package br.com.meveum.auth.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ObterUsuarioAutenticadoResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String email,
    String role
) {
}
