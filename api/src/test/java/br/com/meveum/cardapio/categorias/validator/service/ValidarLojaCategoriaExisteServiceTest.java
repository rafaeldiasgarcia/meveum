package br.com.meveum.cardapio.categorias.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.lojas.repository.LojaRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarLojaCategoriaExisteServiceTest {

    @Mock
    private LojaRepository lojaRepository;

    @InjectMocks
    private ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;

    @Test
    void deveRetornarLojaQuandoExistir() {
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(lojaId);
        when(lojaRepository.findById(lojaId)).thenReturn(Optional.of(loja));

        var resultado = validarLojaCategoriaExisteService.validar(lojaId);

        assertThat(resultado).isEqualTo(loja);
    }

    @Test
    void deveFalharQuandoLojaNaoExistir() {
        var lojaId = UUID.randomUUID();
        when(lojaRepository.findById(lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarLojaCategoriaExisteService.validar(lojaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Loja nao encontrada.");
    }
}
