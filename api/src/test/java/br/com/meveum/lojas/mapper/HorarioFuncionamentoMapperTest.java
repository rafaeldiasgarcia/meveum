package br.com.meveum.lojas.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.lojas.dto.AtualizarHorarioFuncionamentoRequest;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import java.time.LocalTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class HorarioFuncionamentoMapperTest {

    private final HorarioFuncionamentoMapper mapper = new HorarioFuncionamentoMapper();

    @Test
    void deveConverterRequestParaEntity() {
        var loja = new Loja();
        var request = new AtualizarHorarioFuncionamentoRequest(
            (short) 2,
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            true
        );

        var entity = mapper.toEntity(loja, request);

        assertThat(entity.getLoja()).isEqualTo(loja);
        assertThat(entity.getDayOfWeek()).isEqualTo((short) 2);
        assertThat(entity.getOpensAt()).isEqualTo(LocalTime.of(9, 0));
        assertThat(entity.getClosesAt()).isEqualTo(LocalTime.of(18, 0));
        assertThat(entity.getActive()).isTrue();
    }

    @Test
    void deveConverterEntityParaResponse() {
        var id = UUID.randomUUID();
        var entity = new PeriodoFuncionamentoLoja();
        entity.setId(id);
        entity.setDayOfWeek((short) 5);
        entity.setOpensAt(LocalTime.of(10, 0));
        entity.setClosesAt(LocalTime.of(22, 0));
        entity.setActive(false);

        var response = mapper.toHorarioFuncionamentoResponse(entity);

        assertThat(response.id()).isEqualTo(id);
        assertThat(response.diaSemana()).isEqualTo((short) 5);
        assertThat(response.abertura()).isEqualTo(LocalTime.of(10, 0));
        assertThat(response.fechamento()).isEqualTo(LocalTime.of(22, 0));
        assertThat(response.ativo()).isFalse();
    }
}
