package br.com.meveum.repositories;

import br.com.meveum.entities.AreaEntregaLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaEntregaLojaRepository extends JpaRepository<AreaEntregaLoja, UUID> {
}
