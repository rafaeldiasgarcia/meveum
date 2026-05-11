package br.com.meveum.repositories;

import br.com.meveum.entities.UsuarioLoja;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioLojaRepository extends JpaRepository<UsuarioLoja, UUID> {

    Optional<UsuarioLoja> findByEmail(String email);

    boolean existsByEmail(String email);
}
