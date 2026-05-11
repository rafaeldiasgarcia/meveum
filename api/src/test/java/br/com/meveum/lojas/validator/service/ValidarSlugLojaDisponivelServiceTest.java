package br.com.meveum.lojas.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarSlugLojaDisponivelServiceTest {

    @Mock
    private LojaRepository lojaRepository;

    @InjectMocks
    private ValidarSlugLojaDisponivelService service;

    @Test
    void devePermitirSlugDisponivelNaAtualizacao() {
        var lojaId = UUID.randomUUID();
        when(lojaRepository.existsBySlugAndIdNot("loja", lojaId)).thenReturn(false);

        assertThatCode(() -> service.validarAtualizacao(lojaId, "loja")).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoSlugJaExistirEmOutraLoja() {
        var lojaId = UUID.randomUUID();
        when(lojaRepository.existsBySlugAndIdNot("loja", lojaId)).thenReturn(true);

        assertThatThrownBy(() -> service.validarAtualizacao(lojaId, "loja"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe uma loja com esse slug.");
    }
}
