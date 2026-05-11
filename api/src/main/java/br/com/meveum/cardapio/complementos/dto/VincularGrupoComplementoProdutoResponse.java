package br.com.meveum.cardapio.complementos.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record VincularGrupoComplementoProdutoResponse(
    UUID id,
    UUID produtoId,
    UUID grupoComplementoId,
    String nomeGrupoComplemento,
    Integer ordem,
    Boolean ativo
) {
}
