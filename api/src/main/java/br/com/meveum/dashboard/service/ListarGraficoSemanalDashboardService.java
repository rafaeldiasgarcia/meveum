package br.com.meveum.dashboard.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.DadoGraficoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarGraficoSemanalDashboardService {

    private static final List<String> LABELS = List.of("Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom");

    private final DashboardValidator dashboardValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PedidoRepository pedidoRepository;
    private final DashboardMapper dashboardMapper;

    public List<DadoGraficoDashboardResponse> listar(UUID lojaId, OffsetDateTime inicio, OffsetDateTime fim) {
        dashboardValidator.validarPeriodo(inicio, fim);
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);

        var valoresPorDia = new HashMap<Integer, BigDecimal>();
        pedidoRepository.listarFaturamentoPorDiaSemana(lojaId, inicio, fim)
            .forEach(projection -> valoresPorDia.put(projection.getDiaSemana(), projection.getValor()));

        return java.util.stream.IntStream.rangeClosed(1, 7)
            .mapToObj(dia -> dashboardMapper.toDadoGraficoDashboardResponse(
                LABELS.get(dia - 1),
                valoresPorDia.getOrDefault(dia, BigDecimal.ZERO)
            ))
            .toList();
    }
}
