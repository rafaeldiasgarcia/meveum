package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    List<Pedido> findByLojaIdOrderByCreatedAtDesc(UUID lojaId);

    List<Pedido> findByLojaIdAndStatusOrderByCreatedAtDesc(UUID lojaId, StatusPedido status);
}
