package br.com.meveum.pedidos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarClientePedidoServiceTest {

    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @InjectMocks
    private ValidarClientePedidoService service;

    @Test
    void deveRetornarNullQuandoClienteNaoInformado() {
        assertThat(service.validarCliente(UUID.randomUUID(), null)).isNull();
    }

    @Test
    void deveRetornarClienteDaLoja() {
        var lojaId = UUID.randomUUID();
        var clienteId = UUID.randomUUID();
        var cliente = cliente(lojaId, clienteId);
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));

        assertThat(service.validarCliente(lojaId, clienteId)).isEqualTo(cliente);
    }

    @Test
    void deveLancarErroQuandoClienteNaoPertenceALoja() {
        var clienteId = UUID.randomUUID();
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente(UUID.randomUUID(), clienteId)));

        assertThatThrownBy(() -> service.validarCliente(UUID.randomUUID(), clienteId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Cliente nao pertence a loja do pedido.");
    }

    @Test
    void deveRetornarEnderecoParaEntrega() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var cliente = cliente(UUID.randomUUID(), clienteId);
        var endereco = new EnderecoCliente();
        when(enderecoClienteRepository.findByIdAndClienteId(enderecoId, clienteId)).thenReturn(Optional.of(endereco));

        assertThat(service.validarEndereco(TipoRecebimento.DELIVERY, cliente, enderecoId)).isEqualTo(endereco);
    }

    @Test
    void deveRetornarNullParaRetirada() {
        assertThat(service.validarEndereco(TipoRecebimento.PICKUP, null, null)).isNull();
    }

    @Test
    void deveLancarErroQuandoEnderecoNaoExistir() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var cliente = cliente(UUID.randomUUID(), clienteId);
        when(enderecoClienteRepository.findByIdAndClienteId(enderecoId, clienteId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validarEndereco(TipoRecebimento.DELIVERY, cliente, enderecoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Endereco do pedido nao encontrado.");
    }

    private Cliente cliente(UUID lojaId, UUID clienteId) {
        var loja = new Loja();
        loja.setId(lojaId);
        return Cliente.builder()
            .id(clienteId)
            .loja(loja)
            .name("Rafael")
            .phone("11999999999")
            .build();
    }
}
