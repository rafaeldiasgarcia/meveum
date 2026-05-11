package br.com.meveum.repositories;

import br.com.meveum.entities.PeriodoFuncionamentoLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodoFuncionamentoLojaRepository extends JpaRepository<PeriodoFuncionamentoLoja, UUID> {
}
