package br.com.meveum.cardapio.produtos.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record CriarProdutoResponse(
    UUID id,
    UUID lojaId,
    UUID categoriaId,
    String nome,
    String descricao,
    BigDecimal preco,
    String imagemUrl,
    Integer ordem,
    Boolean ativo,
    Boolean disponivel,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
