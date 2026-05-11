package br.com.meveum.cardapio.complementos.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarGrupoComplementoResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String descricao,
    Integer quantidadeMinima,
    Integer quantidadeMaxima,
    Integer ordem,
    Boolean ativo
) {
}
