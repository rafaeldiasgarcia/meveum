package br.com.meveum.lojas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.mapper.HorarioFuncionamentoMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarHorariosFuncionamentoService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    private final HorarioFuncionamentoMapper horarioFuncionamentoMapper;

    public List<HorarioFuncionamentoResponse> listar(UUID lojaId) {
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);
        return periodoFuncionamentoLojaRepository.findByLojaIdOrderByDayOfWeekAsc(lojaId)
            .stream()
            .map(horarioFuncionamentoMapper::toHorarioFuncionamentoResponse)
            .toList();
    }
}
