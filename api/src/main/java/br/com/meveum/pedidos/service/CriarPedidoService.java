package br.com.meveum.pedidos.service;

import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.integracao_whatsapp.service.MontarMensagemPedidoWhatsappService;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoResponse;
import br.com.meveum.pedidos.dto.ItemPedidoResponse;
import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import br.com.meveum.pedidos.entity.ItemPedido;
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
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class CriarPedidoService {

    private final PedidoValidator pedidoValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarLojaPedidoDisponivelService validarLojaPedidoDisponivelService;
    private final ValidarPagamentoPedidoService validarPagamentoPedidoService;
    private final ValidarClientePedidoService validarClientePedidoService;
    private final ValidarProdutoPedidoService validarProdutoPedidoService;
    private final ValidarComplementoPedidoService validarComplementoPedidoService;
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ComplementoItemPedidoRepository complementoItemPedidoRepository;
    private final PedidoMapper pedidoMapper;
    private final ObjectMapper objectMapper;
    private final MontarMensagemPedidoWhatsappService montarMensagemPedidoWhatsappService;

    public CriarPedidoResponse criar(CriarPedidoRequest request) {
        pedidoValidator.validarCriacao(request);
        var loja = validarLojaExisteService.validar(request.lojaId());
        validarLojaPedidoDisponivelService.validar(loja);
        validarPagamentoPedidoService.validar(request.lojaId(), request.formaPagamento());
        var cliente = validarClientePedidoService.validarCliente(request.lojaId(), request.clienteId());
        var endereco = validarClientePedidoService.validarEndereco(request.tipoRecebimento(), cliente, request.enderecoClienteId());

        var itens = new ArrayList<ItemPedido>();
        var complementosPorItem = new HashMap<ItemPedido, java.util.List<ComplementoItemPedido>>();
        var subtotal = BigDecimal.ZERO;

        for (var itemRequest : request.itens()) {
            var produto = validarProdutoPedidoService.validar(request.lojaId(), itemRequest.produtoId());
            var complementos = new ArrayList<ComplementoItemPedido>();
            var totalComplementos = BigDecimal.ZERO;

            if (itemRequest.complementos() != null) {
                for (var complementoRequest : itemRequest.complementos()) {
                    var opcao = validarComplementoPedidoService.validar(request.lojaId(), produto.getId(), complementoRequest.opcaoComplementoId());
                    var totalComplemento = opcao.getAdditionalPrice().multiply(BigDecimal.valueOf(complementoRequest.quantidade()));
                    totalComplementos = totalComplementos.add(totalComplemento);
                    complementos.add(pedidoMapper.toEntity(opcao, complementoRequest.quantidade(), totalComplemento));
                }
            }

            var totalItem = produto.getBasePrice()
                .multiply(BigDecimal.valueOf(itemRequest.quantidade()))
                .add(totalComplementos);
            var item = pedidoMapper.toEntity(itemRequest, produto, totalItem);
            itens.add(item);
            complementosPorItem.put(item, complementos);
            subtotal = subtotal.add(totalItem);
        }

        var taxaEntrega = BigDecimal.ZERO;
        var total = subtotal.add(taxaEntrega);
        validarTroco(request.trocoPara(), total);

        var pedido = pedidoMapper.toEntity(request, subtotal, taxaEntrega, total, toEnderecoSnapshot(endereco));
        pedido.setLoja(loja);
        pedido.setCliente(cliente);
        var pedidoSalvo = pedidoRepository.save(pedido);

        var itensSalvos = new ArrayList<ItemPedido>();
        var complementosSalvosPorItem = new HashMap<ItemPedido, java.util.List<ComplementoItemPedido>>();
        for (var item : itens) {
            item.setPedido(pedidoSalvo);
            var itemSalvo = itemPedidoRepository.save(item);
            itensSalvos.add(itemSalvo);
            var complementosSalvos = new ArrayList<ComplementoItemPedido>();
            for (var complemento : complementosPorItem.getOrDefault(item, java.util.List.of())) {
                complemento.setItemPedido(itemSalvo);
                complementosSalvos.add(complementoItemPedidoRepository.save(complemento));
            }
            complementosSalvosPorItem.put(itemSalvo, complementosSalvos);
        }

        pedidoSalvo.setWhatsappMessage(montarMensagemPedidoWhatsappService.montarPedidoCriado(pedidoSalvo, itensSalvos));
        pedidoSalvo = pedidoRepository.save(pedidoSalvo);

        var itensResponse = pedidoMapper.toItemPedidoResponseList(itensSalvos, complementosSalvosPorItem);
        return pedidoMapper.toCriarPedidoResponse(pedidoSalvo, itensResponse);
    }

    private void validarTroco(BigDecimal trocoPara, BigDecimal total) {
        if (trocoPara != null && trocoPara.compareTo(total) < 0) {
            throw new RegraNegocioException("Valor para troco deve ser maior ou igual ao total do pedido.");
        }
    }

    private String toEnderecoSnapshot(EnderecoCliente endereco) {
        if (endereco == null) {
            return null;
        }

        try {
            var snapshot = new LinkedHashMap<String, String>();
            snapshot.put("rotulo", endereco.getLabel());
            snapshot.put("rua", endereco.getStreet());
            snapshot.put("numero", endereco.getNumber());
            snapshot.put("complemento", endereco.getComplement());
            snapshot.put("bairro", endereco.getNeighborhood());
            snapshot.put("cidade", endereco.getCity());
            snapshot.put("estado", endereco.getState());
            snapshot.put("cep", endereco.getZipCode());
            snapshot.put("referencia", endereco.getReference());
            return objectMapper.writeValueAsString(snapshot);
        } catch (JacksonException exception) {
            throw new RegraNegocioException("Nao foi possivel montar o endereco do pedido.");
        }
    }
}
