package br.com.meveum.crm.clientes.validator.service;

import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarEnderecoClienteExisteService {

    private final EnderecoClienteRepository enderecoClienteRepository;

    public EnderecoCliente validar(UUID clienteId, UUID enderecoId) {
        return enderecoClienteRepository.findByIdAndClienteId(enderecoId, clienteId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Endereco de cliente nao encontrado."));
    }
}
