package br.com.meveum.crm.clientes.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirEnderecoClienteService {

    private final ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final EnderecoClienteRepository enderecoClienteRepository;

    public void excluir(UUID clienteId, UUID enderecoId) {
        var endereco = validarEnderecoClienteExisteService.validar(clienteId, enderecoId);
        validarAcessoLojaService.validar(endereco.getCliente().getLoja().getId());
        enderecoClienteRepository.delete(endereco);
    }
}
