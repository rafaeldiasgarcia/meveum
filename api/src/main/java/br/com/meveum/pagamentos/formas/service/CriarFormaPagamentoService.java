package br.com.meveum.pagamentos.formas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.FormaPagamentoValidator;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoDisponivelService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarFormaPagamentoService {

    private final FormaPagamentoValidator formaPagamentoValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarFormaPagamentoDisponivelService validarFormaPagamentoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    private final FormaPagamentoMapper formaPagamentoMapper;

    public CriarFormaPagamentoResponse criar(CriarFormaPagamentoRequest request) {
        formaPagamentoValidator.validarCriacao(request);
        var loja = validarLojaExisteService.validar(request.lojaId());
        validarAcessoLojaService.validar(loja.getId());
        validarFormaPagamentoDisponivelService.validarCriacao(request.lojaId(), request.formaPagamento());
        var formaPagamento = formaPagamentoMapper.toEntity(request);
        formaPagamento.setLoja(loja);
        var formaPagamentoSalva = formaPagamentoLojaRepository.save(formaPagamento);
        return formaPagamentoMapper.toCriarFormaPagamentoResponse(formaPagamentoSalva);
    }
}
