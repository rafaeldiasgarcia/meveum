package br.com.meveum.dashboard.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.KdsItemDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarKdsDashboardService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final DashboardMapper dashboardMapper;

    public List<KdsItemDashboardResponse> listar(UUID lojaId) {
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);

        var pedidos = pedidoRepository.findByLojaIdAndStatusOrderByUpdatedAtAsc(lojaId, StatusPedido.PREPARING);
        var itensPorPedido = buscarItensPorPedido(pedidos);

        return java.util.stream.IntStream.range(0, pedidos.size())
            .mapToObj(index -> {
                var pedido = pedidos.get(index);
                return dashboardMapper.toKdsItemDashboardResponse(
                    pedido,
                    itensPorPedido.getOrDefault(pedido.getId(), List.of()),
                    index + 1,
                    calcularMinutos(pedido.getUpdatedAt())
                );
            })
            .toList();
    }

    private Map<UUID, List<ItemPedido>> buscarItensPorPedido(List<Pedido> pedidos) {
        var ids = pedidos.stream()
            .map(Pedido::getId)
            .toList();

        if (ids.isEmpty()) {
            return Map.of();
        }

        return itemPedidoRepository.findByPedidoIdIn(ids)
            .stream()
            .collect(Collectors.groupingBy(item -> item.getPedido().getId()));
    }

    private Long calcularMinutos(OffsetDateTime atualizadoEm) {
        return Math.max(0, Duration.between(atualizadoEm, OffsetDateTime.now()).toMinutes());
    }
}
