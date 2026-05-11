package br.com.meveum.cardapio.categorias.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record DetalharCategoriaResponse(
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
