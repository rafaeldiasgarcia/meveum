package br.com.meveum.cardapio.complementos.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ListarOpcaoComplementoResponse(
    UUID id,
    UUID lojaId,
    UUID grupoComplementoId,
    String nome,
    String descricao,
    BigDecimal precoAdicional,
    Integer ordem,
    Boolean ativo
) {
}
