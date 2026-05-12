package br.com.meveum.pagamentos.formas.service;

import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirFormaPagamentoService {

    private final ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    public void excluir(UUID formaPagamentoId) {
        var formaPagamento = validarFormaPagamentoExisteService.validar(formaPagamentoId);
        formaPagamento.setActive(false);
        formaPagamentoLojaRepository.save(formaPagamento);
    }
}
