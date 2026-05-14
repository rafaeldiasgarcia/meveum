package br.com.meveum.crm.clientes.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.dto.DetalharEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharEnderecoClienteService {

    private final ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ClienteMapper clienteMapper;

    public DetalharEnderecoClienteResponse detalhar(UUID clienteId, UUID enderecoId) {
        var endereco = validarEnderecoClienteExisteService.validar(clienteId, enderecoId);
        validarAcessoLojaService.validar(endereco.getCliente().getLoja().getId());
        return clienteMapper.toDetalharEnderecoClienteResponse(endereco);
    }
}
