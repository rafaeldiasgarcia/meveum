package br.com.meveum.cardapio.categorias.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.categorias.dto.DetalharCategoriaResponse;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharCategoriaService {

    private final ValidarCategoriaExisteService validarCategoriaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final CategoriaMapper categoriaMapper;

    public DetalharCategoriaResponse detalhar(UUID categoriaId) {
        var categoria = validarCategoriaExisteService.validar(categoriaId);
        validarAcessoLojaService.validar(categoria.getLoja().getId());
        return categoriaMapper.toDetalharCategoriaResponse(categoria);
    }
}
