package br.com.meveum.pedidos.service;

import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.dto.ListarPedidoResponse;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarPedidoService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    public List<ListarPedidoResponse> listar(UUID lojaId, StatusPedido status) {
        validarLojaExisteService.validar(lojaId);
        var pedidos = status == null
            ? pedidoRepository.findByLojaIdOrderByCreatedAtDesc(lojaId)
            : pedidoRepository.findByLojaIdAndStatusOrderByCreatedAtDesc(lojaId, status);

        return pedidos.stream()
            .map(pedidoMapper::toListarPedidoResponse)
            .toList();
    }
}
