package br.com.meveum.crm.clientes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.clientes.validator.ClienteValidator;
import br.com.meveum.crm.clientes.validator.service.ValidarTelefoneClienteDisponivelService;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarClienteServiceTest {

    @Mock
    private ClienteValidator clienteValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarTelefoneClienteDisponivelService validarTelefoneClienteDisponivelService;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private CriarClienteService service;

    @Test
    void deveCriarCliente() {
        var lojaId = UUID.randomUUID();
        var request = new CriarClienteRequest(lojaId, "Rafael", "11999999999");
        var loja = new Loja();
        var cliente = new Cliente();
        var response = CriarClienteResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(clienteMapper.toEntity(request)).thenReturn(cliente);
        when(clienteRepository.save(cliente)).thenReturn(cliente);
        when(clienteMapper.toCriarClienteResponse(cliente)).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(cliente.getLoja()).isEqualTo(loja);
        verify(clienteValidator).validarCriacao(request);
        verify(validarTelefoneClienteDisponivelService).validarCriacao(lojaId, "11999999999");
    }
}
