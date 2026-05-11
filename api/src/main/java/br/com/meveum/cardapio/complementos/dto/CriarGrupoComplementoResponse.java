package br.com.meveum.cardapio.complementos.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record CriarGrupoComplementoResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String descricao,
    Integer quantidadeMinima,
    Integer quantidadeMaxima,
    Integer ordem,
    Boolean ativo,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
