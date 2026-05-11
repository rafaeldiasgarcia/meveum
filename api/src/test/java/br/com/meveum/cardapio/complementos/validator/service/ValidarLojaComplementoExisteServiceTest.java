package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarLojaComplementoExisteServiceTest {

    @Mock
    private LojaRepository lojaRepository;

    @InjectMocks
    private ValidarLojaComplementoExisteService service;

    @Test
    void deveRetornarLojaQuandoExistir() {
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        when(lojaRepository.findById(lojaId)).thenReturn(Optional.of(loja));

        assertThat(service.validar(lojaId)).isEqualTo(loja);
    }

    @Test
    void deveFalharQuandoLojaNaoExistir() {
        var lojaId = UUID.randomUUID();
        when(lojaRepository.findById(lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(lojaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Loja nao encontrada.");
    }
}
