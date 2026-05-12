package br.com.meveum.pedidos.service;

import br.com.meveum.pedidos.dto.AtualizarStatusPedidoRequest;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoResponse;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.validator.PedidoValidator;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarStatusPedidoService {

    private final PedidoValidator pedidoValidator;
    private final ValidarPedidoExisteService validarPedidoExisteService;
    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    public AtualizarStatusPedidoResponse atualizar(UUID pedidoId, AtualizarStatusPedidoRequest request) {
        pedidoValidator.validarAtualizacaoStatus(request);
        var pedido = validarPedidoExisteService.validar(pedidoId);
        pedido.setStatus(request.status());
        var pedidoSalvo = pedidoRepository.save(pedido);
        return pedidoMapper.toAtualizarStatusPedidoResponse(pedidoSalvo);
    }
}
