package br.com.meveum.lojas.repository;

import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodoFuncionamentoLojaRepository extends JpaRepository<PeriodoFuncionamentoLoja, UUID> {

    List<PeriodoFuncionamentoLoja> findByLojaIdOrderByDayOfWeekAsc(UUID lojaId);

    void deleteByLojaId(UUID lojaId);
}
