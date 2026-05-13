package br.com.meveum.cardapio.categorias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.categorias.dto.DetalharCategoriaResponse;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.lojas.entity.Loja;
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
    private ValidarAcessoLojaService validarAcessoLojaService;

    @Mock
    private CategoriaMapper categoriaMapper;

    @InjectMocks
    private DetalharCategoriaService detalharCategoriaService;

    @Test
    void deveDetalharCategoria() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(lojaId);
        var categoria = new Categoria();
        categoria.setLoja(loja);
        var response = new DetalharCategoriaResponse(categoriaId, lojaId, "Pizzas", null, 1, true, null, null);
        when(validarCategoriaExisteService.validar(categoriaId)).thenReturn(categoria);
        when(categoriaMapper.toDetalharCategoriaResponse(categoria)).thenReturn(response);

        var resultado = detalharCategoriaService.detalhar(categoriaId);

        assertThat(resultado).isEqualTo(response);
        verify(validarAcessoLojaService).validar(lojaId);
    }
}
