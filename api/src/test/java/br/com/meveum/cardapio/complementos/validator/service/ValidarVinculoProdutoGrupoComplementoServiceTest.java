package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
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
class ValidarVinculoProdutoGrupoComplementoServiceTest {

    @Mock
    private ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;

    @InjectMocks
    private ValidarVinculoProdutoGrupoComplementoService service;

    @Test
    void deveBuscarVinculo() {
        var produtoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var vinculo = new ProdutoGrupoComplemento();
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, grupoId))
            .thenReturn(Optional.of(vinculo));

        assertThat(service.buscar(produtoId, grupoId)).contains(vinculo);
    }

    @Test
    void devePermitirCriacaoQuandoNaoExistirVinculoAtivo() {
        var produtoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, grupoId))
            .thenReturn(Optional.empty());

        assertThatCode(() -> service.validarDisponivelParaCriacao(produtoId, grupoId)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoVinculoAtivoJaExistir() {
        var produtoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var vinculo = new ProdutoGrupoComplemento();
        vinculo.setActive(true);
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, grupoId))
            .thenReturn(Optional.of(vinculo));

        assertThatThrownBy(() -> service.validarDisponivelParaCriacao(produtoId, grupoId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Produto ja possui esse grupo de complemento vinculado.");
    }

    @Test
    void deveFalharQuandoVinculoNaoExistir() {
        var produtoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, grupoId))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validarExiste(produtoId, grupoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Vinculo de produto e grupo de complemento nao encontrado.");
    }
}
