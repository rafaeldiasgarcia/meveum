package br.com.meveum.cardapio.categorias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaResponse;
import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.CategoriaValidator;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import br.com.meveum.cardapio.categorias.validator.service.ValidarNomeCategoriaDisponivelService;
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
