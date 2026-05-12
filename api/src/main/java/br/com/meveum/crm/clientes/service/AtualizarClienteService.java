package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.clientes.validator.service.ValidarTelefoneClienteDisponivelService;
import br.com.meveum.crm.repository.ClienteRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarClienteService {

    private final ClienteValidator clienteValidator;
    private final ValidarClienteExisteService validarClienteExisteService;
    private final ValidarTelefoneClienteDisponivelService validarTelefoneClienteDisponivelService;
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public AtualizarClienteResponse atualizar(UUID clienteId, AtualizarClienteRequest request) {
        clienteValidator.validarAtualizacao(request);
        var cliente = validarClienteExisteService.validar(clienteId);
        var lojaId = cliente.getLoja().getId();
        validarTelefoneClienteDisponivelService.validarAtualizacao(lojaId, clienteId, request.telefone());
        clienteMapper.toEntity(request, cliente);
        var clienteSalvo = clienteRepository.save(cliente);
        return clienteMapper.toAtualizarClienteResponse(clienteSalvo);
    }
}
