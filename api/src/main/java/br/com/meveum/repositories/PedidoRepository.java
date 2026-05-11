package br.com.meveum.repositories;

import br.com.meveum.entities.Pedido;
import br.com.meveum.entities.enums.StatusPedido;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    List<Pedido> findByLojaIdAndStatusOrderByCreatedAtDesc(UUID lojaId, StatusPedido status);
}
