package br.com.meveum.lojas.repository;

import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodoFuncionamentoLojaRepository extends JpaRepository<PeriodoFuncionamentoLoja, UUID> {
}
