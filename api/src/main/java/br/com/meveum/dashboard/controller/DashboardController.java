package br.com.meveum.dashboard.controller;

import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
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
}
