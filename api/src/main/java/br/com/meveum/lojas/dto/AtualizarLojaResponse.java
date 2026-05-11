package br.com.meveum.lojas.dto;

import br.com.meveum.lojas.entity.enums.LojaStatus;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarLojaResponse(
    UUID id,
    String nome,
    String slug,
    String logoUrl,
    String whatsappNumber,
    LojaStatus status,
    Boolean pausadaManualmente,
    Boolean operacional,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
