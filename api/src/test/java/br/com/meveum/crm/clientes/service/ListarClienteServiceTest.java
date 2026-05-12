package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.dto.ListarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarClienteServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private ListarClienteService service;

    @Test
    void deveListarClientesDaLoja() {
        var lojaId = UUID.randomUUID();
        var cliente = new Cliente();
        var response = ListarClienteResponse.builder().id(UUID.randomUUID()).build();
        when(clienteRepository.findByLojaIdOrderByNameAsc(lojaId)).thenReturn(List.of(cliente));
        when(clienteMapper.toListarClienteResponse(cliente)).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
    }
}
