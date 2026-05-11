package br.com.meveum.repositories;

import br.com.meveum.entities.Categoria;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    List<Categoria> findByLojaIdOrderBySortOrderAsc(UUID lojaId);

    Optional<Categoria> findByIdAndLojaId(UUID id, UUID lojaId);

    boolean existsByLojaIdAndNameIgnoreCase(UUID lojaId, String name);

    boolean existsByLojaIdAndNameIgnoreCaseAndIdNot(UUID lojaId, String name, UUID id);
}
