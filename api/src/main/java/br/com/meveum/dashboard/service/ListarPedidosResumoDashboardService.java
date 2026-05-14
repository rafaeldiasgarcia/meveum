package br.com.meveum.dashboard.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.PedidoResumoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ListarPedidosResumoDashboardService {

    private static final List<StatusPedido> STATUS_INATIVOS = List.of(StatusPedido.CANCELED, StatusPedido.DONE);

    private final DashboardValidator dashboardValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final DashboardMapper dashboardMapper;
    private final ObjectMapper objectMapper;

    public List<PedidoResumoDashboardResponse> listar(UUID lojaId, Integer limite) {
        dashboardValidator.validarLimite(limite);
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);

        var pedidos = pedidoRepository.findByLojaIdAndStatusNotInOrderByCreatedAtDesc(
            lojaId,
            STATUS_INATIVOS,
            PageRequest.of(0, limite)
        );
        var itensPorPedido = buscarItensPorPedido(pedidos);

        return java.util.stream.IntStream.range(0, pedidos.size())
            .mapToObj(index -> {
                var pedido = pedidos.get(index);
                return dashboardMapper.toPedidoResumoDashboardResponse(
                    pedido,
                    itensPorPedido.getOrDefault(pedido.getId(), List.of()),
                    index + 1,
                    toLocal(pedido),
                    toTempoStr(pedido.getCreatedAt())
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

    private String toLocal(Pedido pedido) {
        if (pedido.getFulfillmentType() == TipoRecebimento.PICKUP) {
            return "Retirada";
        }

        var bairro = extrairBairro(pedido.getDeliveryAddressSnapshot());
        return bairro == null || bairro.isBlank() ? "Delivery" : "Delivery · Bairro " + bairro;
    }

    private String extrairBairro(String enderecoSnapshot) {
        if (enderecoSnapshot == null || enderecoSnapshot.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readTree(enderecoSnapshot).path("bairro").asText(null);
        } catch (JacksonException exception) {
            return null;
        }
    }

    private String toTempoStr(OffsetDateTime criadoEm) {
        var minutos = Math.max(0, Duration.between(criadoEm, OffsetDateTime.now()).toMinutes());
        if (minutos < 60) {
            return "ha " + minutos + " min";
        }

        var horas = minutos / 60;
        return "ha " + horas + "h";
    }
}
