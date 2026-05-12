package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarEnderecoClienteServiceTest {

    @Mock
    private ClienteValidator clienteValidator;
    @Mock
    private ValidarClienteExisteService validarClienteExisteService;
    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private CriarEnderecoClienteService service;

    @Test
    void deveCriarEnderecoCliente() {
        var clienteId = UUID.randomUUID();
        var request = new CriarEnderecoClienteRequest("Casa", "Rua A", "10", null, "Centro", "Sao Paulo", "SP", null, null, null, null);
        var cliente = new Cliente();
        var endereco = new EnderecoCliente();
        var response = CriarEnderecoClienteResponse.builder().id(UUID.randomUUID()).clienteId(clienteId).build();
        when(validarClienteExisteService.validar(clienteId)).thenReturn(cliente);
        when(clienteMapper.toEntity(request)).thenReturn(endereco);
        when(enderecoClienteRepository.save(endereco)).thenReturn(endereco);
        when(clienteMapper.toCriarEnderecoClienteResponse(endereco)).thenReturn(response);

        var resultado = service.criar(clienteId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(endereco.getCliente()).isEqualTo(cliente);
        verify(clienteValidator).validarCriacaoEndereco(request);
    }
}
