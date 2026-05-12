package br.com.meveum.entrega.repository;

import br.com.meveum.entrega.entity.AreaEntregaLoja;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaEntregaLojaRepository extends JpaRepository<AreaEntregaLoja, UUID> {

    List<AreaEntregaLoja> findByLojaIdOrderByNameAsc(UUID lojaId);

    Optional<AreaEntregaLoja> findByIdAndLojaId(UUID id, UUID lojaId);
}
