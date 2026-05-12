package br.com.meveum.integracao_whatsapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.integracao_whatsapp.dto.ObterMensagemWhatsappPedidoResponse;
import br.com.meveum.integracao_whatsapp.mapper.WhatsappMapper;
import br.com.meveum.integracao_whatsapp.validator.WhatsappValidator;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ObterMensagemWhatsappPedidoServiceTest {

    @Mock
    private ValidarPedidoExisteService validarPedidoExisteService;
    @Mock
    private MontarMensagemPedidoWhatsappService montarMensagemPedidoWhatsappService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private WhatsappValidator whatsappValidator;
    @Mock
    private WhatsappMapper whatsappMapper;
    @InjectMocks
    private ObterMensagemWhatsappPedidoService service;

    @Test
    void deveObterMensagemExistente() {
        var pedidoId = UUID.randomUUID();
        var pedido = Pedido.builder().whatsappMessage("Mensagem").build();
        var response = ObterMensagemWhatsappPedidoResponse.builder().pedidoId(pedidoId).build();
        when(validarPedidoExisteService.validar(pedidoId)).thenReturn(pedido);
        when(whatsappMapper.toObterMensagemWhatsappPedidoResponse(pedido)).thenReturn(response);

        var resultado = service.obter(pedidoId);

        assertThat(resultado).isEqualTo(response);
        verify(whatsappValidator).validarPedidoParaEnvio(pedido);
        verify(pedidoRepository, never()).save(pedido);
    }

    @Test
    void deveGerarMensagemQuandoPedidoNaoTemMensagem() {
        var pedidoId = UUID.randomUUID();
        var pedido = new Pedido();
        var response = ObterMensagemWhatsappPedidoResponse.builder().pedidoId(pedidoId).build();
        when(validarPedidoExisteService.validar(pedidoId)).thenReturn(pedido);
        when(montarMensagemPedidoWhatsappService.montarStatusAtualizado(pedido)).thenReturn("Mensagem gerada");
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(whatsappMapper.toObterMensagemWhatsappPedidoResponse(pedido)).thenReturn(response);

        var resultado = service.obter(pedidoId);

        assertThat(resultado).isEqualTo(response);
        assertThat(pedido.getWhatsappMessage()).isEqualTo("Mensagem gerada");
        verify(whatsappValidator).validarPedidoParaEnvio(pedido);
        verify(pedidoRepository).save(pedido);
    }
}
