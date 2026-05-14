package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.dto.ListarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarEnderecoClienteServiceTest {

    @Mock
    private ValidarClienteExisteService validarClienteExisteService;
    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private ListarEnderecoClienteService service;

    @Test
    void deveListarEnderecosDoCliente() {
        var clienteId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var cliente = new Cliente();
        cliente.setLoja(loja);
        var endereco = new EnderecoCliente();
        var response = ListarEnderecoClienteResponse.builder().id(UUID.randomUUID()).build();
        when(validarClienteExisteService.validar(clienteId)).thenReturn(cliente);
        when(enderecoClienteRepository.findByClienteIdOrderByLabelAscStreetAsc(clienteId)).thenReturn(List.of(endereco));
        when(clienteMapper.toListarEnderecoClienteResponse(endereco)).thenReturn(response);

        var resultado = service.listar(clienteId);

        assertThat(resultado).containsExactly(response);
        verify(validarClienteExisteService).validar(clienteId);
    }
}
