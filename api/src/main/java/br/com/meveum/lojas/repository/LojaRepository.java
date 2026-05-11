package br.com.meveum.lojas.repository;

import br.com.meveum.lojas.entity.Loja;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LojaRepository extends JpaRepository<Loja, UUID> {

    Optional<Loja> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
