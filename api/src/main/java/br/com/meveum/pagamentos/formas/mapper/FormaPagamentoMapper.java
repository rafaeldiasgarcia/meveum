package br.com.meveum.pagamentos.formas.mapper;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.DetalharFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.ListarFormaPagamentoResponse;
import org.springframework.stereotype.Component;

@Component
public class FormaPagamentoMapper {

    public FormaPagamentoLoja toEntity(CriarFormaPagamentoRequest request) {
        return FormaPagamentoLoja.builder()
            .method(request.formaPagamento())
            .active(true)
            .build();
    }

    public CriarFormaPagamentoResponse toCriarFormaPagamentoResponse(FormaPagamentoLoja formaPagamentoLoja) {
        return CriarFormaPagamentoResponse.builder()
            .id(formaPagamentoLoja.getId())
            .lojaId(formaPagamentoLoja.getLoja().getId())
            .formaPagamento(formaPagamentoLoja.getMethod())
            .ativo(formaPagamentoLoja.getActive())
            .build();
    }

    public ListarFormaPagamentoResponse toListarFormaPagamentoResponse(FormaPagamentoLoja formaPagamentoLoja) {
        return ListarFormaPagamentoResponse.builder()
            .id(formaPagamentoLoja.getId())
            .lojaId(formaPagamentoLoja.getLoja().getId())
            .formaPagamento(formaPagamentoLoja.getMethod())
            .ativo(formaPagamentoLoja.getActive())
            .build();
    }

    public DetalharFormaPagamentoResponse toDetalharFormaPagamentoResponse(FormaPagamentoLoja formaPagamentoLoja) {
        return DetalharFormaPagamentoResponse.builder()
            .id(formaPagamentoLoja.getId())
            .lojaId(formaPagamentoLoja.getLoja().getId())
            .formaPagamento(formaPagamentoLoja.getMethod())
            .ativo(formaPagamentoLoja.getActive())
            .build();
    }

    public AtualizarFormaPagamentoResponse toAtualizarFormaPagamentoResponse(FormaPagamentoLoja formaPagamentoLoja) {
        return AtualizarFormaPagamentoResponse.builder()
            .id(formaPagamentoLoja.getId())
            .lojaId(formaPagamentoLoja.getLoja().getId())
            .formaPagamento(formaPagamentoLoja.getMethod())
            .ativo(formaPagamentoLoja.getActive())
            .build();
    }

    public void toEntity(AtualizarFormaPagamentoRequest request, FormaPagamentoLoja formaPagamentoLoja) {
        formaPagamentoLoja.setMethod(request.formaPagamento());
        formaPagamentoLoja.setActive(request.ativo());
    }
}
