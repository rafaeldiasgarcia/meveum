package br.com.meveum.cardapio.categorias.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarCategoriaExisteServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ValidarCategoriaExisteService validarCategoriaExisteService;

    @Test
    void deveRetornarCategoriaQuandoExistirPorId() {
        var categoriaId = UUID.randomUUID();
        var categoria = new Categoria();
        categoria.setId(categoriaId);
        when(categoriaRepository.findById(categoriaId)).thenReturn(Optional.of(categoria));

        var resultado = validarCategoriaExisteService.validar(categoriaId);

        assertThat(resultado).isEqualTo(categoria);
    }

    @Test
    void deveFalharQuandoCategoriaNaoExistirPorId() {
        var categoriaId = UUID.randomUUID();
        when(categoriaRepository.findById(categoriaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarCategoriaExisteService.validar(categoriaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Categoria nao encontrada.");
    }

    @Test
    void deveRetornarCategoriaQuandoExistirPorIdELoja() {
        var categoriaId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var categoria = new Categoria();
        categoria.setId(categoriaId);
        when(categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)).thenReturn(Optional.of(categoria));

        var resultado = validarCategoriaExisteService.validar(categoriaId, lojaId);

        assertThat(resultado).isEqualTo(categoria);
    }

    @Test
    void deveFalharQuandoCategoriaNaoExistirPorIdELoja() {
        var categoriaId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        when(categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarCategoriaExisteService.validar(categoriaId, lojaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Categoria nao encontrada.");
    }
}
