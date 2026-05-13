package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarClienteExisteService;
import br.com.meveum.crm.clientes.validator.service.ValidarTelefoneClienteDisponivelService;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarClienteServiceTest {

    @Mock
    private ClienteValidator clienteValidator;
    @Mock
    private ValidarClienteExisteService validarClienteExisteService;
    @Mock
    private ValidarTelefoneClienteDisponivelService validarTelefoneClienteDisponivelService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private AtualizarClienteService service;

    @Test
    void deveAtualizarCliente() {
        var lojaId = UUID.randomUUID();
        var clienteId = UUID.randomUUID();
        var request = new AtualizarClienteRequest("Bruno", "11888888888");
        var loja = new Loja();
        loja.setId(lojaId);
        var cliente = Cliente.builder().loja(loja).build();
        var response = AtualizarClienteResponse.builder().id(clienteId).lojaId(lojaId).build();
        when(validarClienteExisteService.validar(clienteId)).thenReturn(cliente);
        when(clienteRepository.save(cliente)).thenReturn(cliente);
        when(clienteMapper.toAtualizarClienteResponse(cliente)).thenReturn(response);

        var resultado = service.atualizar(clienteId, request);

        assertThat(resultado).isEqualTo(response);
        verify(clienteValidator).validarAtualizacao(request);
        verify(validarAcessoLojaService).validar(lojaId);
        verify(validarTelefoneClienteDisponivelService).validarAtualizacao(lojaId, clienteId, "11888888888");
        verify(clienteMapper).toEntity(request, cliente);
    }
}
