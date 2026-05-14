package br.com.meveum.pedidos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pedidos.dto.DetalharPedidoResponse;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.ComplementoItemPedidoRepository;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharPedidoServiceTest {

    @Mock
    private ValidarPedidoExisteService validarPedidoExisteService;
    @Mock
    private ItemPedidoRepository itemPedidoRepository;
    @Mock
    private ComplementoItemPedidoRepository complementoItemPedidoRepository;
    @Mock
    private PedidoMapper pedidoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private DetalharPedidoService service;

    @Test
    void deveDetalharPedidoComItens() {
        var pedidoId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var pedido = new Pedido();
        pedido.setLoja(loja);
        var item = new ItemPedido();
        item.setId(UUID.randomUUID());
        var response = DetalharPedidoResponse.builder().id(pedidoId).build();
        when(validarPedidoExisteService.validar(pedidoId)).thenReturn(pedido);
        when(itemPedidoRepository.findByPedidoId(pedidoId)).thenReturn(List.of(item));
        when(complementoItemPedidoRepository.findByItemPedidoId(item.getId())).thenReturn(List.of());
        when(pedidoMapper.toItemPedidoResponseList(anyList(), anyMap())).thenReturn(List.of());
        when(pedidoMapper.toDetalharPedidoResponse(pedido, List.of())).thenReturn(response);

        assertThat(service.detalhar(pedidoId)).isEqualTo(response);
    }
}
