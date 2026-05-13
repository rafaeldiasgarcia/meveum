package br.com.meveum.pedidos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.integracao_whatsapp.service.MontarMensagemPedidoWhatsappService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.dto.ComplementoPedidoResponse;
import br.com.meveum.pedidos.dto.CriarComplementoPedidoRequest;
import br.com.meveum.pedidos.dto.CriarItemPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoResponse;
import br.com.meveum.pedidos.dto.ItemPedidoResponse;
import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.pedidos.mapper.PedidoMapper;
import br.com.meveum.pedidos.repository.ComplementoItemPedidoRepository;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.validator.PedidoValidator;
import br.com.meveum.pedidos.validator.service.ValidarClientePedidoService;
import br.com.meveum.pedidos.validator.service.ValidarComplementoPedidoService;
import br.com.meveum.pedidos.validator.service.ValidarLojaPedidoDisponivelService;
import br.com.meveum.pedidos.validator.service.ValidarPagamentoPedidoService;
import br.com.meveum.pedidos.validator.service.ValidarProdutoPedidoService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class CriarPedidoServiceTest {

    @Mock
    private PedidoValidator pedidoValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarLojaPedidoDisponivelService validarLojaPedidoDisponivelService;
    @Mock
    private ValidarPagamentoPedidoService validarPagamentoPedidoService;
    @Mock
    private ValidarClientePedidoService validarClientePedidoService;
    @Mock
    private ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    @Mock
    private ValidarProdutoPedidoService validarProdutoPedidoService;
    @Mock
    private ValidarComplementoPedidoService validarComplementoPedidoService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ItemPedidoRepository itemPedidoRepository;
    @Mock
    private ComplementoItemPedidoRepository complementoItemPedidoRepository;
    @Mock
    private PedidoMapper pedidoMapper;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private MontarMensagemPedidoWhatsappService montarMensagemPedidoWhatsappService;
    @InjectMocks
    private CriarPedidoService service;

    @Test
    void deveCriarPedidoComItemEComplemento() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        var request = new CriarPedidoRequest(
            lojaId,
            null,
            null,
            null,
            "Rafael",
            "11999999999",
            TipoRecebimento.PICKUP,
            FormaPagamento.PIX,
            false,
            null,
            null,
            List.of(new CriarItemPedidoRequest(produtoId, 2, null, List.of(new CriarComplementoPedidoRequest(opcaoId, 1))))
        );
        var loja = new Loja();
        var produto = Produto.builder().id(produtoId).name("Burger").basePrice(BigDecimal.TEN).active(true).build();
        var grupo = GrupoComplemento.builder().id(UUID.randomUUID()).name("Molhos").active(true).build();
        var opcao = OpcaoComplemento.builder().id(opcaoId).grupoComplemento(grupo).name("Maionese").additionalPrice(BigDecimal.valueOf(3)).active(true).build();
        var pedido = new Pedido();
        var item = new ItemPedido();
        var complemento = new ComplementoItemPedido();
        var itemResponse = ItemPedidoResponse.builder()
            .id(UUID.randomUUID())
            .complementos(List.of(ComplementoPedidoResponse.builder().id(UUID.randomUUID()).build()))
            .build();
        var response = CriarPedidoResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(validarClientePedidoService.validarCliente(lojaId, null)).thenReturn(null);
        when(validarClientePedidoService.validarEndereco(TipoRecebimento.PICKUP, null, null)).thenReturn(null);
        when(validarProdutoPedidoService.validar(lojaId, produtoId)).thenReturn(produto);
        when(validarComplementoPedidoService.validar(lojaId, produtoId, opcaoId)).thenReturn(opcao);
        when(pedidoMapper.toEntity(request, BigDecimal.valueOf(23), BigDecimal.ZERO, BigDecimal.valueOf(23), null)).thenReturn(pedido);
        when(pedidoMapper.toEntity(request.itens().getFirst(), produto, BigDecimal.valueOf(23))).thenReturn(item);
        when(pedidoMapper.toEntity(opcao, 1, BigDecimal.valueOf(3))).thenReturn(complemento);
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(itemPedidoRepository.save(item)).thenReturn(item);
        when(complementoItemPedidoRepository.save(complemento)).thenReturn(complemento);
        when(montarMensagemPedidoWhatsappService.montarPedidoCriado(pedido, List.of(item))).thenReturn("Mensagem do pedido");
        when(pedidoMapper.toItemPedidoResponseList(anyList(), anyMap())).thenReturn(List.of(itemResponse));
        when(pedidoMapper.toCriarPedidoResponse(pedido, List.of(itemResponse))).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(pedido.getLoja()).isEqualTo(loja);
        assertThat(pedido.getWhatsappMessage()).isEqualTo("Mensagem do pedido");
        assertThat(item.getPedido()).isEqualTo(pedido);
        assertThat(complemento.getItemPedido()).isEqualTo(item);
        verify(pedidoValidator).validarCriacao(request);
        verify(validarLojaPedidoDisponivelService).validar(loja);
        verify(validarPagamentoPedidoService).validar(lojaId, FormaPagamento.PIX);
        verify(pedidoRepository, times(2)).save(pedido);
    }

    @Test
    void deveCriarPedidoEntregaComTaxaDaAreaEntrega() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var areaEntregaId = UUID.randomUUID();
        var enderecoClienteId = UUID.randomUUID();
        var request = new CriarPedidoRequest(
            lojaId,
            null,
            enderecoClienteId,
            areaEntregaId,
            "Rafael",
            "11999999999",
            TipoRecebimento.DELIVERY,
            FormaPagamento.PIX,
            false,
            null,
            null,
            List.of(new CriarItemPedidoRequest(produtoId, 2, null, List.of()))
        );
        var loja = new Loja();
        var produto = Produto.builder().id(produtoId).name("Burger").basePrice(BigDecimal.TEN).active(true).build();
        var areaEntrega = AreaEntregaLoja.builder()
            .id(areaEntregaId)
            .fee(BigDecimal.valueOf(8))
            .minimumOrderValue(BigDecimal.valueOf(15))
            .active(true)
            .build();
        var pedido = new Pedido();
        var item = new ItemPedido();
        var response = CriarPedidoResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(validarClientePedidoService.validarCliente(lojaId, null)).thenReturn(null);
        when(validarClientePedidoService.validarEndereco(TipoRecebimento.DELIVERY, null, enderecoClienteId)).thenReturn(null);
        when(validarProdutoPedidoService.validar(lojaId, produtoId)).thenReturn(produto);
        when(validarAreaEntregaExisteService.validar(areaEntregaId, lojaId)).thenReturn(areaEntrega);
        when(pedidoMapper.toEntity(request, BigDecimal.valueOf(20), BigDecimal.valueOf(8), BigDecimal.valueOf(28), null)).thenReturn(pedido);
        when(pedidoMapper.toEntity(request.itens().getFirst(), produto, BigDecimal.valueOf(20))).thenReturn(item);
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        when(itemPedidoRepository.save(item)).thenReturn(item);
        when(montarMensagemPedidoWhatsappService.montarPedidoCriado(pedido, List.of(item))).thenReturn("Mensagem do pedido");
        when(pedidoMapper.toItemPedidoResponseList(anyList(), anyMap())).thenReturn(List.of());
        when(pedidoMapper.toCriarPedidoResponse(pedido, List.of())).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        verify(validarAreaEntregaExisteService).validar(areaEntregaId, lojaId);
    }
}
