package br.com.meveum.dashboard.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ObterResumoDashboardService {

    private final DashboardValidator dashboardValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PedidoRepository pedidoRepository;
    private final DashboardMapper dashboardMapper;

    public ObterResumoDashboardResponse obter(UUID lojaId, OffsetDateTime inicio, OffsetDateTime fim) {
        dashboardValidator.validarPeriodo(inicio, fim);
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);

        var duracao = Duration.between(inicio, fim);
        var inicioPeriodoAnterior = inicio.minus(duracao);
        var fimPeriodoAnterior = inicio;

        var faturamentoTotal = pedidoRepository.somarFaturamentoPorLojaEPeriodo(lojaId, inicio, fim);
        var quantidadePedidos = pedidoRepository.contarPedidosValidosPorLojaEPeriodo(lojaId, inicio, fim);
        var ticketMedio = calcularTicketMedio(faturamentoTotal, quantidadePedidos);
        var tempoMedioCozinha = pedidoRepository.calcularTempoMedioCozinhaMinutos(lojaId, inicio, fim);

        var faturamentoAnterior = pedidoRepository.somarFaturamentoPorLojaEPeriodo(lojaId, inicioPeriodoAnterior, fimPeriodoAnterior);
        var quantidadeAnterior = pedidoRepository.contarPedidosValidosPorLojaEPeriodo(
            lojaId,
            inicioPeriodoAnterior,
            fimPeriodoAnterior
        );
        var ticketAnterior = calcularTicketMedio(faturamentoAnterior, quantidadeAnterior);
        var tempoCozinhaAnterior = pedidoRepository.calcularTempoMedioCozinhaMinutos(
            lojaId,
            inicioPeriodoAnterior,
            fimPeriodoAnterior
        );

        return dashboardMapper.toObterResumoDashboardResponse(
            lojaId,
            faturamentoTotal,
            quantidadePedidos,
            ticketMedio,
            normalizarDouble(tempoMedioCozinha),
            calcularVariacao(BigDecimal.valueOf(quantidadePedidos), BigDecimal.valueOf(quantidadeAnterior)),
            calcularVariacao(faturamentoTotal, faturamentoAnterior),
            calcularVariacao(ticketMedio, ticketAnterior),
            calcularVariacao(normalizarDouble(tempoMedioCozinha), normalizarDouble(tempoCozinhaAnterior)),
            pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.NEW, inicio, fim),
            pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.PREPARING, inicio, fim),
            pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.OUT_FOR_DELIVERY, inicio, fim),
            pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.DONE, inicio, fim),
            pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.CANCELED, inicio, fim)
        );
    }

    private BigDecimal calcularTicketMedio(BigDecimal faturamentoTotal, Long quantidadePedidos) {
        if (quantidadePedidos == 0) {
            return BigDecimal.ZERO;
        }

        return faturamentoTotal.divide(BigDecimal.valueOf(quantidadePedidos), 2, RoundingMode.HALF_UP);
    }

    private Double normalizarDouble(Double valor) {
        return valor == null ? 0D : valor;
    }

    private Double calcularVariacao(Double atual, Double anterior) {
        return calcularVariacao(BigDecimal.valueOf(atual), BigDecimal.valueOf(anterior));
    }

    private Double calcularVariacao(BigDecimal atual, BigDecimal anterior) {
        if (anterior == null || anterior.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO.doubleValue();
        }

        return atual.subtract(anterior)
            .divide(anterior, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .doubleValue();
    }
}
