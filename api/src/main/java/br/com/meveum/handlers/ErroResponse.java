package br.com.meveum.handlers;

import java.time.OffsetDateTime;

public record ErroResponse(
    String mensagem,
    OffsetDateTime timestamp
) {
}
