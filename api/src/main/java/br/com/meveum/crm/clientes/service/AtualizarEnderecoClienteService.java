package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarEnderecoClienteService {

    private final ClienteValidator clienteValidator;
    private final ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    private final EnderecoClienteRepository enderecoClienteRepository;
    private final ClienteMapper clienteMapper;

    public AtualizarEnderecoClienteResponse atualizar(UUID clienteId, UUID enderecoId, AtualizarEnderecoClienteRequest request) {
        clienteValidator.validarAtualizacaoEndereco(request);
        var endereco = validarEnderecoClienteExisteService.validar(clienteId, enderecoId);
        clienteMapper.toEntity(request, endereco);
        var enderecoSalvo = enderecoClienteRepository.save(endereco);
        return clienteMapper.toAtualizarEnderecoClienteResponse(enderecoSalvo);
    }
}
