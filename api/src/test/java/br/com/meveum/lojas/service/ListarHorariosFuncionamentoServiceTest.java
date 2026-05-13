package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import br.com.meveum.lojas.mapper.HorarioFuncionamentoMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarHorariosFuncionamentoServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    @Mock
    private HorarioFuncionamentoMapper horarioFuncionamentoMapper;
    @InjectMocks
    private ListarHorariosFuncionamentoService service;

    @Test
    void deveListarHorariosDaLoja() {
        var lojaId = UUID.randomUUID();
        var entity = new PeriodoFuncionamentoLoja();
        var response = HorarioFuncionamentoResponse.builder().diaSemana((short) 1).build();
        when(periodoFuncionamentoLojaRepository.findByLojaIdOrderByDayOfWeekAsc(lojaId)).thenReturn(List.of(entity));
        when(horarioFuncionamentoMapper.toHorarioFuncionamentoResponse(entity)).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }
}
