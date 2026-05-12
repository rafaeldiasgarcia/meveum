package br.com.meveum.pedidos.validator.service;

import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarClientePedidoService {

    private final ClienteRepository clienteRepository;
    private final EnderecoClienteRepository enderecoClienteRepository;

    public Cliente validarCliente(UUID lojaId, UUID clienteId) {
        if (clienteId == null) {
            return null;
        }

        var cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente do pedido nao encontrado."));

        if (!cliente.getLoja().getId().equals(lojaId)) {
            throw new RegraNegocioException("Cliente nao pertence a loja do pedido.");
        }

        return cliente;
    }

    public EnderecoCliente validarEndereco(TipoRecebimento tipoRecebimento, Cliente cliente, UUID enderecoClienteId) {
        if (tipoRecebimento == TipoRecebimento.PICKUP) {
            return null;
        }

        if (cliente == null) {
            throw new RegraNegocioException("Cliente cadastrado e obrigatorio para entrega.");
        }

        return enderecoClienteRepository.findByIdAndClienteId(enderecoClienteId, cliente.getId())
            .orElseThrow(() -> new RecursoNaoEncontradoException("Endereco do pedido nao encontrado."));
    }
}
