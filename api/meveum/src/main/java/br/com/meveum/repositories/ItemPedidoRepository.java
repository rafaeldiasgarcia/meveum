package br.com.meveum.repositories;

import br.com.meveum.entities.ItemPedido;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, UUID> {
}
