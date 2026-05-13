package br.com.meveum.auth.dto;

import java.time.OffsetDateTime;
import lombok.Builder;

@Builder
public record SolicitarRecuperacaoSenhaResponse(
    String mensagem,
    String token,
    OffsetDateTime expiraEm
) {
}
