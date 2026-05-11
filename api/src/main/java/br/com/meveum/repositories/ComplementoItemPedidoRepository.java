package br.com.meveum.repositories;

import br.com.meveum.entities.ComplementoItemPedido;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplementoItemPedidoRepository extends JpaRepository<ComplementoItemPedido, UUID> {
}
