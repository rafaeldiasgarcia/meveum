package br.com.meveum.cardapio.complementos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
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
class ValidarGrupoComplementoExisteServiceTest {

    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;

    @InjectMocks
    private ValidarGrupoComplementoExisteService service;

    @Test
    void deveRetornarGrupoQuandoExistir() {
        var id = UUID.randomUUID();
        var grupo = new GrupoComplemento();
        when(grupoComplementoRepository.findById(id)).thenReturn(Optional.of(grupo));

        assertThat(service.validar(id)).isEqualTo(grupo);
    }

    @Test
    void deveRetornarGrupoDaLojaQuandoExistir() {
        var id = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var grupo = new GrupoComplemento();
        when(grupoComplementoRepository.findByIdAndLojaId(id, lojaId)).thenReturn(Optional.of(grupo));

        assertThat(service.validar(id, lojaId)).isEqualTo(grupo);
    }

    @Test
    void deveFalharQuandoGrupoNaoExistir() {
        var id = UUID.randomUUID();
        when(grupoComplementoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(id))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Grupo de complemento nao encontrado.");
    }

    @Test
    void deveFalharQuandoGrupoEstiverInativo() {
        var id = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var grupo = new GrupoComplemento();
        grupo.setActive(false);
        when(grupoComplementoRepository.findByIdAndLojaId(id, lojaId)).thenReturn(Optional.of(grupo));

        assertThatThrownBy(() -> service.validarAtivo(id, lojaId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Grupo de complemento precisa estar ativo.");
    }
}
