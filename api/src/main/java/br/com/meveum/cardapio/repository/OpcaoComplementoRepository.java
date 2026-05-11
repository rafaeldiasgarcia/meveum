package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpcaoComplementoRepository extends JpaRepository<OpcaoComplemento, UUID> {

    List<OpcaoComplemento> findByGrupoComplementoIdOrderBySortOrderAsc(UUID grupoComplementoId);

    Optional<OpcaoComplemento> findByIdAndLojaId(UUID id, UUID lojaId);

    boolean existsByGrupoComplementoIdAndNameIgnoreCase(UUID grupoComplementoId, String name);

    boolean existsByGrupoComplementoIdAndNameIgnoreCaseAndIdNot(UUID grupoComplementoId, String name, UUID id);
}
