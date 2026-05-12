package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.dto.DetalharEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import br.com.meveum.crm.entity.EnderecoCliente;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharEnderecoClienteServiceTest {

    @Mock
    private ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private DetalharEnderecoClienteService service;

    @Test
    void deveDetalharEnderecoCliente() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var endereco = new EnderecoCliente();
        var response = DetalharEnderecoClienteResponse.builder().id(enderecoId).clienteId(clienteId).build();
        when(validarEnderecoClienteExisteService.validar(clienteId, enderecoId)).thenReturn(endereco);
        when(clienteMapper.toDetalharEnderecoClienteResponse(endereco)).thenReturn(response);

        var resultado = service.detalhar(clienteId, enderecoId);

        assertThat(resultado).isEqualTo(response);
    }
}
