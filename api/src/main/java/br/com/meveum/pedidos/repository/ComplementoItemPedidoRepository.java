package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplementoItemPedidoRepository extends JpaRepository<ComplementoItemPedido, UUID> {
}
