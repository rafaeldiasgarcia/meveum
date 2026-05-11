package br.com.meveum.dtos.categorias;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarCategoriaResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String descricao,
    Integer ordem,
    Boolean ativo,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
