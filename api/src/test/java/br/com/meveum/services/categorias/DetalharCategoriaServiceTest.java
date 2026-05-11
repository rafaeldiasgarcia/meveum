package br.com.meveum.services.categorias;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.dtos.categorias.DetalharCategoriaResponse;
import br.com.meveum.entities.Categoria;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharCategoriaServiceTest {

    @Mock
    private ValidarCategoriaExisteService validarCategoriaExisteService;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private DetalharCategoriaService detalharCategoriaService;

    @Test
    void deveDetalharCategoria() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var categoria = new Categoria();
        var response = new DetalharCategoriaResponse(categoriaId, lojaId, "Pizzas", null, 1, true, null, null);
        when(validarCategoriaExisteService.validar(categoriaId)).thenReturn(categoria);
        when(categoriaMapper.toDetalharCategoriaResponse(categoria)).thenReturn(response);

        var resultado = detalharCategoriaService.detalhar(categoriaId);

        assertThat(resultado).isEqualTo(response);
    }
}
