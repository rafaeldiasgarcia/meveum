package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarNomeGrupoComplementoDisponivelServiceTest {

    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;

    @InjectMocks
    private ValidarNomeGrupoComplementoDisponivelService service;

    @Test
    void devePermitirNomeDisponivelNaCriacao() {
        var lojaId = UUID.randomUUID();
        when(grupoComplementoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Bebidas")).thenReturn(false);

        assertThatCode(() -> service.validarCriacao(lojaId, "Bebidas")).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoNomeJaExistirNaCriacao() {
        var lojaId = UUID.randomUUID();
        when(grupoComplementoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Bebidas")).thenReturn(true);

        assertThatThrownBy(() -> service.validarCriacao(lojaId, "Bebidas"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe um grupo de complemento com esse nome.");
    }

    @Test
    void deveFalharQuandoNomeJaExistirNaAtualizacao() {
        var lojaId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        when(grupoComplementoRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, "Bebidas", grupoId))
            .thenReturn(true);

        assertThatThrownBy(() -> service.validarAtualizacao(lojaId, grupoId, "Bebidas"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe um grupo de complemento com esse nome.");
    }
}
