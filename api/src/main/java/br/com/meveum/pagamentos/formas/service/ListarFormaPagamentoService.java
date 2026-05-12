package br.com.meveum.pagamentos.formas.service;

import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.formas.dto.ListarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarFormaPagamentoService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    private final FormaPagamentoMapper formaPagamentoMapper;

    public List<ListarFormaPagamentoResponse> listar(UUID lojaId) {
        validarLojaExisteService.validar(lojaId);

        return formaPagamentoLojaRepository.findByLojaIdOrderByMethodAsc(lojaId)
            .stream()
            .map(formaPagamentoMapper::toListarFormaPagamentoResponse)
            .toList();
    }
}
