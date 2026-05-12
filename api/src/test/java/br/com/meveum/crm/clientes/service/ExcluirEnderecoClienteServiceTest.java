package br.com.meveum.crm.clientes.service;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirEnderecoClienteServiceTest {

    @Mock
    private ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @InjectMocks
    private ExcluirEnderecoClienteService service;

    @Test
    void deveExcluirEnderecoCliente() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var endereco = new EnderecoCliente();
        when(validarEnderecoClienteExisteService.validar(clienteId, enderecoId)).thenReturn(endereco);

        service.excluir(clienteId, enderecoId);

        verify(enderecoClienteRepository).delete(endereco);
    }
}
