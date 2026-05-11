package br.com.meveum.dtos.categorias;

import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarCategoriaResponse(
    UUID id,
    UUID lojaId,
    String nome,
    String descricao,
    Integer ordem,
    Boolean ativo
) {
}
