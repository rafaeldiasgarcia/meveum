package br.com.meveum.pagamentos.formas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.FormaPagamentoValidator;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoDisponivelService;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarFormaPagamentoService {

    private final FormaPagamentoValidator formaPagamentoValidator;
    private final ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    private final ValidarFormaPagamentoDisponivelService validarFormaPagamentoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    private final FormaPagamentoMapper formaPagamentoMapper;

    public AtualizarFormaPagamentoResponse atualizar(UUID formaPagamentoId, AtualizarFormaPagamentoRequest request) {
        formaPagamentoValidator.validarAtualizacao(request);
        var formaPagamento = validarFormaPagamentoExisteService.validar(formaPagamentoId);
        var lojaId = formaPagamento.getLoja().getId();
        validarAcessoLojaService.validar(lojaId);
        validarFormaPagamentoDisponivelService.validarAtualizacao(lojaId, formaPagamentoId, request.formaPagamento());
        formaPagamentoMapper.toEntity(request, formaPagamento);
        var formaPagamentoSalva = formaPagamentoLojaRepository.save(formaPagamento);
        return formaPagamentoMapper.toAtualizarFormaPagamentoResponse(formaPagamentoSalva);
    }
}
