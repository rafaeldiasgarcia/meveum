package br.com.meveum.auth.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarEmailUsuarioLojaDisponivelServiceTest {

    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @InjectMocks
    private ValidarEmailUsuarioLojaDisponivelService service;

    @Test
    void devePermitirEmailDisponivel() {
        when(usuarioLojaRepository.existsByEmailIgnoreCase("admin@meveum.com")).thenReturn(false);

        assertThatCode(() -> service.validar("admin@meveum.com")).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarEmailEmUso() {
        when(usuarioLojaRepository.existsByEmailIgnoreCase("admin@meveum.com")).thenReturn(true);

        assertThatThrownBy(() -> service.validar("admin@meveum.com"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe um usuario com esse email.");
    }
}
