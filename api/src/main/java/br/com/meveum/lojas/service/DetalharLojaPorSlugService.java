package br.com.meveum.lojas.service;

import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharLojaPorSlugService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final LojaMapper lojaMapper;

    public DetalharLojaResponse detalhar(String slug) {
        var loja = validarLojaExisteService.validarPorSlug(slug);
        return lojaMapper.toDetalharLojaResponse(loja);
    }
}
