package br.com.meveum.entrega.repository;

import br.com.meveum.entrega.entity.AreaEntregaLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaEntregaLojaRepository extends JpaRepository<AreaEntregaLoja, UUID> {
}
