package br.com.meveum.pedidos.service;

import br.com.meveum.pedidos.dto.DetalharPedidoResponse;
import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.ComplementoItemPedidoRepository;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharPedidoService {

    private final ValidarPedidoExisteService validarPedidoExisteService;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ComplementoItemPedidoRepository complementoItemPedidoRepository;
    private final PedidoMapper pedidoMapper;

    public DetalharPedidoResponse detalhar(UUID pedidoId) {
        var pedido = validarPedidoExisteService.validar(pedidoId);
        var itens = itemPedidoRepository.findByPedidoId(pedidoId);
        var complementosPorItem = new HashMap<ItemPedido, List<ComplementoItemPedido>>();
        for (var item : itens) {
            complementosPorItem.put(item, complementoItemPedidoRepository.findByItemPedidoId(item.getId()));
        }
        return pedidoMapper.toDetalharPedidoResponse(pedido, pedidoMapper.toItemPedidoResponseList(itens, complementosPorItem));
    }
}
