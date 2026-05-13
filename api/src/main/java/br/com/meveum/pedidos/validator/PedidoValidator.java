package br.com.meveum.pedidos.validator;

import br.com.meveum.pedidos.dto.AtualizarStatusPedidoRequest;
import br.com.meveum.pedidos.dto.CriarComplementoPedidoRequest;
import br.com.meveum.pedidos.dto.CriarItemPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class PedidoValidator {

    public void validarCriacao(CriarPedidoRequest request) {
        validarCliente(request);
        validarEntrega(request);
        validarPagamento(request);
        validarItens(request);
    }

    public void validarAtualizacaoStatus(AtualizarStatusPedidoRequest request) {
        if (request.status() == null) {
            throw new RegraNegocioException("Status do pedido e obrigatorio.");
        }
    }

    public void validarTransicaoStatus(StatusPedido statusAtual, StatusPedido proximoStatus) {
        validarAtualizacaoStatus(new AtualizarStatusPedidoRequest(proximoStatus));

        if (statusAtual == proximoStatus) {
            return;
        }

        var permitido = switch (statusAtual) {
            case NEW -> proximoStatus == StatusPedido.PREPARING || proximoStatus == StatusPedido.CANCELED;
            case PREPARING -> proximoStatus == StatusPedido.OUT_FOR_DELIVERY
                || proximoStatus == StatusPedido.DONE
                || proximoStatus == StatusPedido.CANCELED;
            case OUT_FOR_DELIVERY -> proximoStatus == StatusPedido.DONE || proximoStatus == StatusPedido.CANCELED;
            case DONE, CANCELED -> false;
        };

        if (!permitido) {
            throw new RegraNegocioException("Transicao de status do pedido nao permitida.");
        }
    }

    private void validarCliente(CriarPedidoRequest request) {
        if (request.nomeCliente() == null || request.nomeCliente().isBlank()) {
            throw new RegraNegocioException("Nome do cliente e obrigatorio.");
        }

        if (request.telefoneCliente() == null || request.telefoneCliente().isBlank()) {
            throw new RegraNegocioException("Telefone do cliente e obrigatorio.");
        }
    }

    private void validarEntrega(CriarPedidoRequest request) {
        if (request.tipoRecebimento() == null) {
            throw new RegraNegocioException("Tipo de recebimento do pedido e obrigatorio.");
        }

        if (request.tipoRecebimento() == TipoRecebimento.DELIVERY && request.enderecoClienteId() == null) {
            throw new RegraNegocioException("Endereco do cliente e obrigatorio para entrega.");
        }
    }

    private void validarPagamento(CriarPedidoRequest request) {
        if (request.formaPagamento() == null) {
            throw new RegraNegocioException("Forma de pagamento do pedido e obrigatoria.");
        }

        if (Boolean.TRUE.equals(request.precisaTroco()) && request.trocoPara() == null) {
            throw new RegraNegocioException("Valor para troco e obrigatorio.");
        }

        if (request.trocoPara() != null && request.trocoPara().compareTo(BigDecimal.ZERO) < 0) {
            throw new RegraNegocioException("Valor para troco nao pode ser negativo.");
        }
    }

    private void validarItens(CriarPedidoRequest request) {
        if (request.itens() == null || request.itens().isEmpty()) {
            throw new RegraNegocioException("Pedido precisa ter ao menos um item.");
        }

        request.itens().forEach(this::validarItem);
    }

    private void validarItem(CriarItemPedidoRequest item) {
        if (item.produtoId() == null) {
            throw new RegraNegocioException("Produto do item e obrigatorio.");
        }

        if (item.quantidade() == null || item.quantidade() <= 0) {
            throw new RegraNegocioException("Quantidade do item deve ser maior que zero.");
        }

        if (item.complementos() != null) {
            item.complementos().forEach(this::validarComplemento);
        }
    }

    private void validarComplemento(CriarComplementoPedidoRequest complemento) {
        if (complemento.opcaoComplementoId() == null) {
            throw new RegraNegocioException("Opcao de complemento e obrigatoria.");
        }

        if (complemento.quantidade() == null || complemento.quantidade() <= 0) {
            throw new RegraNegocioException("Quantidade do complemento deve ser maior que zero.");
        }
    }
}
