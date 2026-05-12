package br.com.meveum.pedidos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.dto.ListarPedidoResponse;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarPedidoServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private PedidoMapper pedidoMapper;
    @InjectMocks
    private ListarPedidoService service;

    @Test
    void deveListarPedidosPorStatus() {
        var lojaId = UUID.randomUUID();
        var pedido = new Pedido();
        var response = ListarPedidoResponse.builder().id(UUID.randomUUID()).build();
        when(pedidoRepository.findByLojaIdAndStatusOrderByCreatedAtDesc(lojaId, StatusPedido.NEW)).thenReturn(List.of(pedido));
        when(pedidoMapper.toListarPedidoResponse(pedido)).thenReturn(response);

        var resultado = service.listar(lojaId, StatusPedido.NEW);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
    }

    @Test
    void deveListarPedidosSemStatus() {
        var lojaId = UUID.randomUUID();
        when(pedidoRepository.findByLojaIdOrderByCreatedAtDesc(lojaId)).thenReturn(List.of());

        assertThat(service.listar(lojaId, null)).isEmpty();
    }
}
