package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarOpcaoComplementoExisteServiceTest {

    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;

    @InjectMocks
    private ValidarOpcaoComplementoExisteService service;

    @Test
    void deveRetornarOpcaoQuandoExistir() {
        var id = UUID.randomUUID();
        var opcao = new OpcaoComplemento();
        when(opcaoComplementoRepository.findById(id)).thenReturn(Optional.of(opcao));

        assertThat(service.validar(id)).isEqualTo(opcao);
    }

    @Test
    void deveRetornarOpcaoDaLojaQuandoExistir() {
        var id = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var opcao = new OpcaoComplemento();
        when(opcaoComplementoRepository.findByIdAndLojaId(id, lojaId)).thenReturn(Optional.of(opcao));

        assertThat(service.validar(id, lojaId)).isEqualTo(opcao);
    }

    @Test
    void deveFalharQuandoOpcaoNaoExistir() {
        var id = UUID.randomUUID();
        when(opcaoComplementoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(id))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Opcao de complemento nao encontrada.");
    }
}
