package br.com.meveum.pedidos.validator.service;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarPedidoExisteService {

    private final PedidoRepository pedidoRepository;

    public Pedido validar(UUID pedidoId) {
        return pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido nao encontrado."));
    }
}
