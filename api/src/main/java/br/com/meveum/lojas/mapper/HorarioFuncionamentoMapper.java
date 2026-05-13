package br.com.meveum.lojas.mapper;

import br.com.meveum.lojas.dto.AtualizarHorarioFuncionamentoRequest;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import org.springframework.stereotype.Component;

@Component
public class HorarioFuncionamentoMapper {

    public PeriodoFuncionamentoLoja toEntity(Loja loja, AtualizarHorarioFuncionamentoRequest request) {
        var horario = new PeriodoFuncionamentoLoja();
        horario.setLoja(loja);
        horario.setDayOfWeek(request.diaSemana());
        horario.setOpensAt(request.abertura());
        horario.setClosesAt(request.fechamento());
        horario.setActive(request.ativo());
        return horario;
    }

    public HorarioFuncionamentoResponse toHorarioFuncionamentoResponse(PeriodoFuncionamentoLoja horario) {
        return HorarioFuncionamentoResponse.builder()
            .id(horario.getId())
            .diaSemana(horario.getDayOfWeek())
            .abertura(horario.getOpensAt())
            .fechamento(horario.getClosesAt())
            .ativo(horario.getActive())
            .build();
    }
}
