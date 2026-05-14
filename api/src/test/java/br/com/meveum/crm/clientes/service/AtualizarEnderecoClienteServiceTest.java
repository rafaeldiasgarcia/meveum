package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarEnderecoClienteExisteService;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarEnderecoClienteServiceTest {

    @Mock
    private ClienteValidator clienteValidator;
    @Mock
    private ValidarEnderecoClienteExisteService validarEnderecoClienteExisteService;
    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private AtualizarEnderecoClienteService service;

    @Test
    void deveAtualizarEnderecoCliente() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var request = new AtualizarEnderecoClienteRequest("Casa", "Rua A", "10", null, "Centro", "Sao Paulo", "SP", null, null, null, null);
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var cliente = new Cliente();
        cliente.setLoja(loja);
        var endereco = new EnderecoCliente();
        endereco.setCliente(cliente);
        var response = AtualizarEnderecoClienteResponse.builder().id(enderecoId).clienteId(clienteId).build();
        when(validarEnderecoClienteExisteService.validar(clienteId, enderecoId)).thenReturn(endereco);
        when(enderecoClienteRepository.save(endereco)).thenReturn(endereco);
        when(clienteMapper.toAtualizarEnderecoClienteResponse(endereco)).thenReturn(response);

        var resultado = service.atualizar(clienteId, enderecoId, request);

        assertThat(resultado).isEqualTo(response);
        verify(clienteValidator).validarAtualizacaoEndereco(request);
        verify(clienteMapper).toEntity(request, endereco);
    }
}
