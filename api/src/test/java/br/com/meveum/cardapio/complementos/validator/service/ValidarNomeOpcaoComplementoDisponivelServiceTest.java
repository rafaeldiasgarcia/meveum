package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarNomeOpcaoComplementoDisponivelServiceTest {

    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;

    @InjectMocks
    private ValidarNomeOpcaoComplementoDisponivelService service;

    @Test
    void devePermitirNomeDisponivelNaCriacao() {
        var grupoId = UUID.randomUUID();
        when(opcaoComplementoRepository.existsByGrupoComplementoIdAndNameIgnoreCase(grupoId, "Coca")).thenReturn(false);

        assertThatCode(() -> service.validarCriacao(grupoId, "Coca")).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoNomeJaExistirNaCriacao() {
        var grupoId = UUID.randomUUID();
        when(opcaoComplementoRepository.existsByGrupoComplementoIdAndNameIgnoreCase(grupoId, "Coca")).thenReturn(true);

        assertThatThrownBy(() -> service.validarCriacao(grupoId, "Coca"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe uma opcao de complemento com esse nome.");
    }

    @Test
    void deveFalharQuandoNomeJaExistirNaAtualizacao() {
        var grupoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        when(opcaoComplementoRepository.existsByGrupoComplementoIdAndNameIgnoreCaseAndIdNot(grupoId, "Coca", opcaoId))
            .thenReturn(true);

        assertThatThrownBy(() -> service.validarAtualizacao(grupoId, opcaoId, "Coca"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe uma opcao de complemento com esse nome.");
    }
}
