package br.com.meveum.pedidos.repository.projection;

import java.math.BigDecimal;

public interface ProdutoMaisVendidoProjection {

    String getProdutoId();

    String getNomeProduto();

    Long getQuantidadeVendida();

    BigDecimal getFaturamento();
}
