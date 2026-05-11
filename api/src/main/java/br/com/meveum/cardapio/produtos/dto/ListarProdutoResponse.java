package br.com.meveum.cardapio.produtos.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarProdutoResponse(
    UUID id,
    UUID lojaId,
    UUID categoriaId,
    String nome,
    String descricao,
    BigDecimal preco,
    String imagemUrl,
    Integer ordem,
    Boolean ativo
) {
}
