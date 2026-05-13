package br.com.meveum.lojas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.AtualizarHorariosFuncionamentoRequest;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.mapper.HorarioFuncionamentoMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarHorariosFuncionamentoService {

    private final LojaValidator lojaValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    private final HorarioFuncionamentoMapper horarioFuncionamentoMapper;

    @Transactional
    public List<HorarioFuncionamentoResponse> atualizar(UUID lojaId, AtualizarHorariosFuncionamentoRequest request) {
        var loja = validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);
        request.horarios().forEach(lojaValidator::validarHorarioFuncionamento);

        periodoFuncionamentoLojaRepository.deleteByLojaId(lojaId);
        periodoFuncionamentoLojaRepository.flush();

        return request.horarios()
            .stream()
            .map(horario -> horarioFuncionamentoMapper.toEntity(loja, horario))
            .map(periodoFuncionamentoLojaRepository::save)
            .map(horarioFuncionamentoMapper::toHorarioFuncionamentoResponse)
            .toList();
    }
}
