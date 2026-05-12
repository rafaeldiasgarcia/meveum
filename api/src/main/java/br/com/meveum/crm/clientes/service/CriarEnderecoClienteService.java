package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarEnderecoClienteService {

    private final ClienteValidator clienteValidator;
    private final ValidarClienteExisteService validarClienteExisteService;
    private final EnderecoClienteRepository enderecoClienteRepository;
    private final ClienteMapper clienteMapper;

    public CriarEnderecoClienteResponse criar(UUID clienteId, CriarEnderecoClienteRequest request) {
        clienteValidator.validarCriacaoEndereco(request);
        var cliente = validarClienteExisteService.validar(clienteId);
        var endereco = clienteMapper.toEntity(request);
        endereco.setCliente(cliente);
        var enderecoSalvo = enderecoClienteRepository.save(endereco);
        return clienteMapper.toCriarEnderecoClienteResponse(enderecoSalvo);
    }
}
