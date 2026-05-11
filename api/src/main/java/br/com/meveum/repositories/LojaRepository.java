package br.com.meveum.repositories;

import br.com.meveum.entities.Loja;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LojaRepository extends JpaRepository<Loja, UUID> {

    Optional<Loja> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
