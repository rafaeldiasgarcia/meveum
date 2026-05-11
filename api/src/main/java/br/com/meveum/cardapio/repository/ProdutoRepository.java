package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.Produto;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByLojaIdOrderBySortOrderAsc(UUID lojaId);

    List<Produto> findByLojaIdAndCategoriaIdOrderBySortOrderAsc(UUID lojaId, UUID categoriaId);

    Optional<Produto> findByIdAndLojaId(UUID id, UUID lojaId);

    boolean existsByLojaIdAndNameIgnoreCase(UUID lojaId, String name);

    boolean existsByLojaIdAndNameIgnoreCaseAndIdNot(UUID lojaId, String name, UUID id);
}
