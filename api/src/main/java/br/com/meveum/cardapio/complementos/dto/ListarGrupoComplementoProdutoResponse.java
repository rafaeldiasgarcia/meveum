package br.com.meveum.cardapio.complementos.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarGrupoComplementoProdutoResponse(
    UUID id,
    UUID produtoId,
    UUID grupoComplementoId,
    String nomeGrupoComplemento,
    Integer quantidadeMinima,
    Integer quantidadeMaxima,
    Integer ordem,
    Boolean ativo
) {
}
