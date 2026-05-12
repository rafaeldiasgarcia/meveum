package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarTelefoneClienteDisponivelService;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarClienteService {

    private final ClienteValidator clienteValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarTelefoneClienteDisponivelService validarTelefoneClienteDisponivelService;
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public CriarClienteResponse criar(CriarClienteRequest request) {
        clienteValidator.validarCriacao(request);
        var loja = validarLojaExisteService.validar(request.lojaId());
        validarTelefoneClienteDisponivelService.validarCriacao(request.lojaId(), request.telefone());
        var cliente = clienteMapper.toEntity(request);
        cliente.setLoja(loja);
        var clienteSalvo = clienteRepository.save(cliente);
        return clienteMapper.toCriarClienteResponse(clienteSalvo);
    }
}
