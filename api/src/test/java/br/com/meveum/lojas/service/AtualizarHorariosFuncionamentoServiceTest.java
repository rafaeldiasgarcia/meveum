package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.AtualizarHorarioFuncionamentoRequest;
import br.com.meveum.lojas.dto.AtualizarHorariosFuncionamentoRequest;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import br.com.meveum.lojas.mapper.HorarioFuncionamentoMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarHorariosFuncionamentoServiceTest {

    @Mock
    private LojaValidator lojaValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    @Mock
    private HorarioFuncionamentoMapper horarioFuncionamentoMapper;
    @InjectMocks
    private AtualizarHorariosFuncionamentoService service;

    @Test
    void deveAtualizarHorarios() {
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        var item = new AtualizarHorarioFuncionamentoRequest(
            (short) 1,
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            true
        );
        var request = new AtualizarHorariosFuncionamentoRequest(List.of(item));
        var entity = new PeriodoFuncionamentoLoja();
        var response = HorarioFuncionamentoResponse.builder().diaSemana((short) 1).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(horarioFuncionamentoMapper.toEntity(loja, item)).thenReturn(entity);
        when(periodoFuncionamentoLojaRepository.save(entity)).thenReturn(entity);
        when(horarioFuncionamentoMapper.toHorarioFuncionamentoResponse(entity)).thenReturn(response);

        var resultado = service.atualizar(lojaId, request);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
        verify(lojaValidator).validarHorarioFuncionamento(item);
        verify(periodoFuncionamentoLojaRepository).deleteByLojaId(lojaId);
        verify(periodoFuncionamentoLojaRepository).flush();
    }
}
