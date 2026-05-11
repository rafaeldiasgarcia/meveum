package br.com.meveum.lojas.repository;

import br.com.meveum.lojas.entity.UsuarioLoja;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioLojaRepository extends JpaRepository<UsuarioLoja, UUID> {

    Optional<UsuarioLoja> findByEmail(String email);

    boolean existsByEmail(String email);
}
