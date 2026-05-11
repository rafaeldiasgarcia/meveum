package br.com.meveum.cardapio.categorias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.categorias.dto.ListarCategoriaResponse;
import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.service.ValidarLojaCategoriaExisteService;
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
