package br.com.meveum.pedidos.repository.projection;

import java.math.BigDecimal;

public interface FaturamentoDiaProjection {

    Integer getDiaSemana();

    BigDecimal getValor();
}
