package br.com.meveum.crm.clientes.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.dto.ListarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarEnderecoClienteService {

    private final ValidarClienteExisteService validarClienteExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final EnderecoClienteRepository enderecoClienteRepository;
    private final ClienteMapper clienteMapper;

    public List<ListarEnderecoClienteResponse> listar(UUID clienteId) {
        var cliente = validarClienteExisteService.validar(clienteId);
        validarAcessoLojaService.validar(cliente.getLoja().getId());
        return enderecoClienteRepository.findByClienteIdOrderByLabelAscStreetAsc(clienteId)
            .stream()
            .map(clienteMapper::toListarEnderecoClienteResponse)
            .toList();
    }
}
