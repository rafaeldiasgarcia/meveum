package br.com.meveum.services.categorias;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.dtos.categorias.ListarCategoriaResponse;
import br.com.meveum.entities.Categoria;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.services.ValidarLojaCategoriaExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarCategoriaServiceTest {

    @Mock
    private ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private ListarCategoriaService listarCategoriaService;

    @Test
    void deveListarCategoriasDaLoja() {
        var lojaId = UUID.randomUUID();
        var categoria = new Categoria();
        var response = new ListarCategoriaResponse(UUID.randomUUID(), lojaId, "Pizzas", null, 1, true);
        when(categoriaRepository.findByLojaIdOrderBySortOrderAsc(lojaId)).thenReturn(List.of(categoria));
        when(categoriaMapper.toListarCategoriaResponse(categoria)).thenReturn(response);

        var resultado = listarCategoriaService.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaCategoriaExisteService).validar(lojaId);
    }
}
