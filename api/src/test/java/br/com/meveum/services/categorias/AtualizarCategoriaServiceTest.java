package br.com.meveum.services.categorias;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.dtos.categorias.AtualizarCategoriaRequest;
import br.com.meveum.dtos.categorias.AtualizarCategoriaResponse;
import br.com.meveum.entities.Categoria;
import br.com.meveum.entities.Loja;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.CategoriaValidator;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
import br.com.meveum.validators.categorias.services.ValidarNomeCategoriaDisponivelService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarCategoriaServiceTest {

    @Mock
    private CategoriaValidator categoriaValidator;

    @Mock
    private ValidarCategoriaExisteService validarCategoriaExisteService;

    @Mock
    private ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private AtualizarCategoriaService atualizarCategoriaService;

    @Test
    void deveAtualizarCategoria() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var request = new AtualizarCategoriaRequest("Massas", "Artesanais", 3, true);
        var loja = new Loja();
        loja.setId(lojaId);
        var categoria = new Categoria();
        categoria.setId(categoriaId);
        categoria.setLoja(loja);
        var categoriaSalva = new Categoria();
        var response = new AtualizarCategoriaResponse(categoriaId, lojaId, "Massas", "Artesanais", 3, true, null, null);

        when(validarCategoriaExisteService.validar(categoriaId)).thenReturn(categoria);
        when(categoriaRepository.save(categoria)).thenReturn(categoriaSalva);
        when(categoriaMapper.toAtualizarCategoriaResponse(categoriaSalva)).thenReturn(response);

        var resultado = atualizarCategoriaService.atualizar(categoriaId, request);

        assertThat(resultado).isEqualTo(response);
        verify(categoriaValidator).validarAtualizacao(request);
        verify(validarNomeCategoriaDisponivelService).validarAtualizacao(lojaId, categoriaId, "Massas");
        verify(categoriaMapper).toEntity(request, categoria);
    }
}
