package br.com.meveum.crm.clientes.validator.service;

import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarClienteExisteService {

    private final ClienteRepository clienteRepository;

    public Cliente validar(UUID clienteId) {
        return clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente nao encontrado."));
    }
}
