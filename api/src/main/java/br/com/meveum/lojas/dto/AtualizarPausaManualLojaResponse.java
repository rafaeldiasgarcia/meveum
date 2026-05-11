package br.com.meveum.lojas.dto;

import br.com.meveum.lojas.entity.enums.LojaStatus;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarPausaManualLojaResponse(
    UUID id,
    LojaStatus status,
    Boolean pausadaManualmente,
    Boolean operacional,
    OffsetDateTime atualizadoEm
) {
}
