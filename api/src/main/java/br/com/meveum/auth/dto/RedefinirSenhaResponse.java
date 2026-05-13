package br.com.meveum.auth.dto;

import lombok.Builder;

@Builder
public record RedefinirSenhaResponse(
    String mensagem
) {
}
