package br.com.meveum.dashboard.controller;

import br.com.meveum.dashboard.dto.ClienteRecorrenteDashboardResponse;
import br.com.meveum.dashboard.dto.DadoGraficoDashboardResponse;
import br.com.meveum.dashboard.dto.KdsItemDashboardResponse;
import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
import br.com.meveum.dashboard.dto.PedidoResumoDashboardResponse;
import br.com.meveum.dashboard.service.ListarClientesRecorrentesDashboardService;
import br.com.meveum.dashboard.service.ListarGraficoSemanalDashboardService;
import br.com.meveum.dashboard.service.ListarKdsDashboardService;
import br.com.meveum.dashboard.service.ListarPedidosResumoDashboardService;
import br.com.meveum.dashboard.service.ListarProdutosMaisVendidosDashboardService;
import br.com.meveum.dashboard.service.ObterResumoDashboardService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {

    private final ObterResumoDashboardService obterResumoDashboardService;
    private final ListarProdutosMaisVendidosDashboardService listarProdutosMaisVendidosDashboardService;
    private final ListarGraficoSemanalDashboardService listarGraficoSemanalDashboardService;
    private final ListarPedidosResumoDashboardService listarPedidosResumoDashboardService;
    private final ListarKdsDashboardService listarKdsDashboardService;
    private final ListarClientesRecorrentesDashboardService listarClientesRecorrentesDashboardService;

    @GetMapping("/resumo")
    @ResponseStatus(HttpStatus.OK)
    public ObterResumoDashboardResponse obterResumo(
        @RequestParam UUID lojaId,
        @RequestParam OffsetDateTime inicio,
        @RequestParam OffsetDateTime fim
    ) {
        return obterResumoDashboardService.obter(lojaId, inicio, fim);
    }

    @GetMapping("/produtos-mais-vendidos")
    @ResponseStatus(HttpStatus.OK)
    public List<ListarProdutoMaisVendidoResponse> listarProdutosMaisVendidos(
        @RequestParam UUID lojaId,
        @RequestParam OffsetDateTime inicio,
        @RequestParam OffsetDateTime fim,
        @RequestParam(defaultValue = "5") Integer limite
    ) {
        return listarProdutosMaisVendidosDashboardService.listar(lojaId, inicio, fim, limite);
    }

    @GetMapping("/grafico-semanal")
    @ResponseStatus(HttpStatus.OK)
    public List<DadoGraficoDashboardResponse> listarGraficoSemanal(
        @RequestParam UUID lojaId,
        @RequestParam OffsetDateTime inicio,
        @RequestParam OffsetDateTime fim
    ) {
        return listarGraficoSemanalDashboardService.listar(lojaId, inicio, fim);
    }

    @GetMapping("/pedidos-resumo")
    @ResponseStatus(HttpStatus.OK)
    public List<PedidoResumoDashboardResponse> listarPedidosResumo(
        @RequestParam UUID lojaId,
        @RequestParam(defaultValue = "10") Integer limite
    ) {
        return listarPedidosResumoDashboardService.listar(lojaId, limite);
    }

    @GetMapping("/kds")
    @ResponseStatus(HttpStatus.OK)
    public List<KdsItemDashboardResponse> listarKds(@RequestParam UUID lojaId) {
        return listarKdsDashboardService.listar(lojaId);
    }

    @GetMapping("/clientes-recorrentes")
    @ResponseStatus(HttpStatus.OK)
    public List<ClienteRecorrenteDashboardResponse> listarClientesRecorrentes(
        @RequestParam UUID lojaId,
        @RequestParam(defaultValue = "5") Integer limite
    ) {
        return listarClientesRecorrentesDashboardService.listar(lojaId, limite);
    }
}
