package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.ItemPedido;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, UUID> {
}
