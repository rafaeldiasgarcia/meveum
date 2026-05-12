package br.com.meveum.pedidos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarPedidoExisteServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;
    @InjectMocks
    private ValidarPedidoExisteService service;

    @Test
    void deveRetornarPedidoQuandoExistir() {
        var pedidoId = UUID.randomUUID();
        var pedido = new Pedido();
        when(pedidoRepository.findById(pedidoId)).thenReturn(Optional.of(pedido));

        assertThat(service.validar(pedidoId)).isEqualTo(pedido);
    }

    @Test
    void deveLancarErroQuandoPedidoNaoExistir() {
        var pedidoId = UUID.randomUUID();
        when(pedidoRepository.findById(pedidoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(pedidoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Pedido nao encontrado.");
    }
}
