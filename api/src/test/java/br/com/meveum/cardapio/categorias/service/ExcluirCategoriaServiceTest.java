package br.com.meveum.cardapio.categorias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirCategoriaServiceTest {

    @Mock
    private ValidarCategoriaExisteService validarCategoriaExisteService;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private ExcluirCategoriaService excluirCategoriaService;

    @Test
    void deveInativarCategoria() {
        var categoriaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var categoria = new Categoria();
        categoria.setLoja(loja);
        categoria.setActive(true);
        when(validarCategoriaExisteService.validar(categoriaId)).thenReturn(categoria);

        excluirCategoriaService.excluir(categoriaId);

        assertThat(categoria.getActive()).isFalse();
        verify(categoriaRepository).save(categoria);
    }
}
