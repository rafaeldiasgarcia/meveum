package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoComplementoRepository extends JpaRepository<GrupoComplemento, UUID> {

    List<GrupoComplemento> findByLojaIdOrderBySortOrderAsc(UUID lojaId);

    Optional<GrupoComplemento> findByIdAndLojaId(UUID id, UUID lojaId);

    boolean existsByLojaIdAndNameIgnoreCase(UUID lojaId, String name);

    boolean existsByLojaIdAndNameIgnoreCaseAndIdNot(UUID lojaId, String name, UUID id);
}
