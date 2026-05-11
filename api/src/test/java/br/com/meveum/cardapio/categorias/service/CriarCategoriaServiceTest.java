package br.com.meveum.cardapio.categorias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaResponse;
import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.CategoriaValidator;
import br.com.meveum.cardapio.categorias.validator.service.ValidarLojaCategoriaExisteService;
import br.com.meveum.cardapio.categorias.validator.service.ValidarNomeCategoriaDisponivelService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarCategoriaServiceTest {

    @Mock
    private CategoriaValidator categoriaValidator;

    @Mock
    private ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;

    @Mock
    private ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private CriarCategoriaService criarCategoriaService;

    @Test
    void deveCriarCategoria() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var request = new CriarCategoriaRequest(lojaId, "Pizzas", "Sabores especiais", 1);
        var loja = new Loja();
        loja.setId(lojaId);
        var categoria = new Categoria();
        var categoriaSalva = new Categoria();
        categoriaSalva.setId(categoriaId);
        var response = new CriarCategoriaResponse(categoriaId, lojaId, "Pizzas", "Sabores especiais", 1, true, null, null);

        when(validarLojaCategoriaExisteService.validar(lojaId)).thenReturn(loja);
        when(categoriaMapper.toEntity(request)).thenReturn(categoria);
        when(categoriaRepository.save(categoria)).thenReturn(categoriaSalva);
        when(categoriaMapper.toCriarCategoriaResponse(categoriaSalva)).thenReturn(response);

        var resultado = criarCategoriaService.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(categoria.getLoja()).isEqualTo(loja);
        verify(categoriaValidator).validarCriacao(request);
        verify(validarNomeCategoriaDisponivelService).validarCriacao(lojaId, "Pizzas");
    }
}
