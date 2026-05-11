package br.com.meveum.services.categorias;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.dtos.categorias.CriarCategoriaRequest;
import br.com.meveum.dtos.categorias.CriarCategoriaResponse;
import br.com.meveum.entities.Categoria;
import br.com.meveum.entities.Loja;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.CategoriaValidator;
import br.com.meveum.validators.categorias.services.ValidarLojaCategoriaExisteService;
import br.com.meveum.validators.categorias.services.ValidarNomeCategoriaDisponivelService;
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
