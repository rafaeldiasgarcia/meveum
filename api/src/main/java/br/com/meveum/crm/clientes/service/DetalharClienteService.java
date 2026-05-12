package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.DetalharClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharClienteService {

    private final ValidarClienteExisteService validarClienteExisteService;
    private final ClienteMapper clienteMapper;

    public DetalharClienteResponse detalhar(UUID clienteId) {
        var cliente = validarClienteExisteService.validar(clienteId);
        return clienteMapper.toDetalharClienteResponse(cliente);
    }
}
