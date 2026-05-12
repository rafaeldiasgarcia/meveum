package br.com.meveum.pedidos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.integracao_whatsapp.service.MontarMensagemPedidoWhatsappService;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoRequest;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoResponse;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.validator.PedidoValidator;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarStatusPedidoServiceTest {

    @Mock
    private PedidoValidator pedidoValidator;
    @Mock
    private ValidarPedidoExisteService validarPedidoExisteService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private PedidoMapper pedidoMapper;
    @Mock
    private MontarMensagemPedidoWhatsappService montarMensagemPedidoWhatsappService;
    @InjectMocks
    private AtualizarStatusPedidoService service;

    @Test
    void deveAtualizarStatusPedido() {
        var pedidoId = UUID.randomUUID();
        var request = new AtualizarStatusPedidoRequest(StatusPedido.PREPARING);
        var pedido = new Pedido();
        var response = AtualizarStatusPedidoResponse.builder().id(pedidoId).status(StatusPedido.PREPARING).build();
        when(validarPedidoExisteService.validar(pedidoId)).thenReturn(pedido);
        when(montarMensagemPedidoWhatsappService.montarStatusAtualizado(pedido)).thenReturn("Status atualizado");
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(pedidoMapper.toAtualizarStatusPedidoResponse(pedido)).thenReturn(response);

        var resultado = service.atualizar(pedidoId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.PREPARING);
        assertThat(pedido.getWhatsappMessage()).isEqualTo("Status atualizado");
        verify(pedidoValidator).validarAtualizacaoStatus(request);
    }
}
