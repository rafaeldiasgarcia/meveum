package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.dto.DetalharClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.entity.Cliente;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharClienteServiceTest {

    @Mock
    private ValidarClienteExisteService validarClienteExisteService;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private DetalharClienteService service;

    @Test
    void deveDetalharCliente() {
        var clienteId = UUID.randomUUID();
        var cliente = new Cliente();
        var response = DetalharClienteResponse.builder().id(clienteId).build();
        when(validarClienteExisteService.validar(clienteId)).thenReturn(cliente);
        when(clienteMapper.toDetalharClienteResponse(cliente)).thenReturn(response);

        var resultado = service.detalhar(clienteId);

        assertThat(resultado).isEqualTo(response);
    }
}
