package br.com.meveum.dashboard.service;

import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarProdutosMaisVendidosDashboardService {

    private final DashboardValidator dashboardValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ItemPedidoRepository itemPedidoRepository;
    private final DashboardMapper dashboardMapper;

    public List<ListarProdutoMaisVendidoResponse> listar(UUID lojaId, OffsetDateTime inicio, OffsetDateTime fim, Integer limite) {
        dashboardValidator.validarPeriodo(inicio, fim);
        dashboardValidator.validarLimite(limite);
        validarLojaExisteService.validar(lojaId);
        return itemPedidoRepository.listarProdutosMaisVendidos(lojaId, inicio, fim, limite)
            .stream()
            .map(dashboardMapper::toListarProdutoMaisVendidoResponse)
            .toList();
    }
}
