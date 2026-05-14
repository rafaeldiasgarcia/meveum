package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, UUID> {

    List<ItemPedido> findByPedidoId(UUID pedidoId);

    List<ItemPedido> findByPedidoIdIn(List<UUID> pedidoIds);

    @Query(value = """
        select
            cast(i.product_id as varchar) as produtoId,
            i.product_name as nomeProduto,
            sum(i.quantity) as quantidadeVendida,
            sum(i.total) as faturamento
        from order_items i
        join orders o on o.id = i.order_id
        where o.store_id = :lojaId
          and o.status <> 'CANCELED'
          and o.created_at between :inicio and :fim
        group by i.product_id, i.product_name
        order by sum(i.quantity) desc, sum(i.total) desc
        limit :limite
        """, nativeQuery = true)
    List<ProdutoMaisVendidoProjection> listarProdutosMaisVendidos(
        @Param("lojaId") UUID lojaId,
        @Param("inicio") OffsetDateTime inicio,
        @Param("fim") OffsetDateTime fim,
        @Param("limite") int limite
    );
}
