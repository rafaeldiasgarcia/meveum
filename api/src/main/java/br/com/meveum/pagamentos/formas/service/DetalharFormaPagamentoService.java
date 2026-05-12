package br.com.meveum.pagamentos.formas.service;

import br.com.meveum.pagamentos.formas.dto.DetalharFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharFormaPagamentoService {

    private final ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    private final FormaPagamentoMapper formaPagamentoMapper;

    public DetalharFormaPagamentoResponse detalhar(UUID formaPagamentoId) {
        var formaPagamento = validarFormaPagamentoExisteService.validar(formaPagamentoId);
        return formaPagamentoMapper.toDetalharFormaPagamentoResponse(formaPagamento);
    }
}
