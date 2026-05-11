package br.com.meveum.shared.exception;

import java.time.OffsetDateTime;

public record ErroResponse(
    String mensagem,
    OffsetDateTime timestamp
) {
}
