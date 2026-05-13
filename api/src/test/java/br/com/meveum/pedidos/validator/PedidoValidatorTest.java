package br.com.meveum.pedidos.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoRequest;
import br.com.meveum.pedidos.dto.CriarItemPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PedidoValidatorTest {

    private final PedidoValidator pedidoValidator = new PedidoValidator();

    @Test
    void deveValidarCriacaoValida() {
        assertThatCode(() -> pedidoValidator.validarCriacao(request(TipoRecebimento.PICKUP, null))).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoDeliverySemEndereco() {
        var request = request(TipoRecebimento.DELIVERY, null);

        assertThatThrownBy(() -> pedidoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Endereco do cliente e obrigatorio para entrega.");
    }

    @Test
    void deveLancarErroQuandoTrocoSemValor() {
        var request = new CriarPedidoRequest(UUID.randomUUID(), null, null, null, "Rafael", "11999999999", TipoRecebimento.PICKUP, FormaPagamento.CASH, true, null, null, List.of(item()));

        assertThatThrownBy(() -> pedidoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Valor para troco e obrigatorio.");
    }

    @Test
    void deveLancarErroQuandoPedidoSemItens() {
        var request = new CriarPedidoRequest(UUID.randomUUID(), null, null, null, "Rafael", "11999999999", TipoRecebimento.PICKUP, FormaPagamento.PIX, false, null, null, List.of());

        assertThatThrownBy(() -> pedidoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Pedido precisa ter ao menos um item.");
    }

    @Test
    void deveValidarAtualizacaoStatusValida() {
        assertThatCode(() -> pedidoValidator.validarAtualizacaoStatus(new AtualizarStatusPedidoRequest(StatusPedido.PREPARING))).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoStatusNaoInformado() {
        assertThatThrownBy(() -> pedidoValidator.validarAtualizacaoStatus(new AtualizarStatusPedidoRequest(null)))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Status do pedido e obrigatorio.");
    }

    private CriarPedidoRequest request(TipoRecebimento tipoRecebimento, UUID enderecoId) {
        return new CriarPedidoRequest(UUID.randomUUID(), null, enderecoId, null, "Rafael", "11999999999", tipoRecebimento, FormaPagamento.PIX, false, BigDecimal.TEN, null, List.of(item()));
    }

    private CriarItemPedidoRequest item() {
        return new CriarItemPedidoRequest(UUID.randomUUID(), 1, null, List.of());
    }
}
