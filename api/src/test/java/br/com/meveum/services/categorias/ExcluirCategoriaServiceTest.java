package br.com.meveum.services.categorias;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.entities.Categoria;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
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

    @InjectMocks
    private ExcluirCategoriaService excluirCategoriaService;

    @Test
    void deveInativarCategoria() {
        var categoriaId = UUID.randomUUID();
        var categoria = new Categoria();
        categoria.setActive(true);
        when(validarCategoriaExisteService.validar(categoriaId)).thenReturn(categoria);

        excluirCategoriaService.excluir(categoriaId);

        assertThat(categoria.getActive()).isFalse();
        verify(categoriaRepository).save(categoria);
    }
}
