package br.com.meveum.cardapio.categorias.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirCategoriaService {

    private final ValidarCategoriaExisteService validarCategoriaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final CategoriaRepository categoriaRepository;

    public void excluir(UUID categoriaId) {
        var categoria = validarCategoriaExisteService.validar(categoriaId);
        validarAcessoLojaService.validar(categoria.getLoja().getId());
        categoria.setActive(false);
        categoriaRepository.save(categoria);
    }
}
