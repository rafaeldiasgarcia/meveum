package br.com.meveum.pagamentos.formas.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormaPagamentoMapperTest {

    private final FormaPagamentoMapper formaPagamentoMapper = new FormaPagamentoMapper();

    @Test
    void deveConverterCriarRequestParaEntity() {
        var request = new CriarFormaPagamentoRequest(UUID.randomUUID(), FormaPagamento.PIX);

        var entity = formaPagamentoMapper.toEntity(request);

        assertThat(entity.getLoja()).isNull();
        assertThat(entity.getMethod()).isEqualTo(FormaPagamento.PIX);
        assertThat(entity.getActive()).isTrue();
    }

    @Test
    void deveConverterEntityParaResponses() {
        var entity = formaPagamentoLoja();

        assertThat(formaPagamentoMapper.toCriarFormaPagamentoResponse(entity).id()).isEqualTo(entity.getId());
        assertThat(formaPagamentoMapper.toListarFormaPagamentoResponse(entity).lojaId()).isEqualTo(entity.getLoja().getId());
        assertThat(formaPagamentoMapper.toDetalharFormaPagamentoResponse(entity).formaPagamento()).isEqualTo(entity.getMethod());
        assertThat(formaPagamentoMapper.toAtualizarFormaPagamentoResponse(entity).ativo()).isEqualTo(entity.getActive());
    }

    @Test
    void deveAtualizarEntityComRequest() {
        var entity = formaPagamentoLoja();
        var request = new AtualizarFormaPagamentoRequest(FormaPagamento.CASH, false);

        formaPagamentoMapper.toEntity(request, entity);

        assertThat(entity.getMethod()).isEqualTo(FormaPagamento.CASH);
        assertThat(entity.getActive()).isFalse();
    }

    private FormaPagamentoLoja formaPagamentoLoja() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var formaPagamento = new FormaPagamentoLoja();
        formaPagamento.setId(UUID.randomUUID());
        formaPagamento.setLoja(loja);
        formaPagamento.setMethod(FormaPagamento.PIX);
        formaPagamento.setActive(true);
        return formaPagamento;
    }
}
