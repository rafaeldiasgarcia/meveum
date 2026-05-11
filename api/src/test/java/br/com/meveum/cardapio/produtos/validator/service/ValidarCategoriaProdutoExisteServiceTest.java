package br.com.meveum.cardapio.produtos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarCategoriaProdutoExisteServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;

    @Test
    void deveRetornarCategoriaAtivaQuandoExistir() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var categoria = new Categoria();
        categoria.setActive(true);
        when(categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)).thenReturn(Optional.of(categoria));

        assertThat(validarCategoriaProdutoExisteService.validar(categoriaId, lojaId)).isEqualTo(categoria);
    }

    @Test
    void deveFalharQuandoCategoriaNaoExistir() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        when(categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarCategoriaProdutoExisteService.validar(categoriaId, lojaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Categoria nao encontrada.");
    }

    @Test
    void deveFalharQuandoCategoriaEstiverInativa() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var categoria = new Categoria();
        categoria.setActive(false);
        when(categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)).thenReturn(Optional.of(categoria));

        assertThatThrownBy(() -> validarCategoriaProdutoExisteService.validar(categoriaId, lojaId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Categoria precisa estar ativa para receber produtos.");
    }
}
