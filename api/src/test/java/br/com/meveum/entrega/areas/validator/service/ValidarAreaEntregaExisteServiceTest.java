package br.com.meveum.entrega.areas.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarAreaEntregaExisteServiceTest {

    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;

    @InjectMocks
    private ValidarAreaEntregaExisteService service;

    @Test
    void deveRetornarAreaQuandoExistir() {
        var areaId = UUID.randomUUID();
        var area = new AreaEntregaLoja();
        when(areaEntregaLojaRepository.findById(areaId)).thenReturn(Optional.of(area));

        assertThat(service.validar(areaId)).isEqualTo(area);
    }

    @Test
    void deveFalharQuandoAreaNaoExistir() {
        var areaId = UUID.randomUUID();
        when(areaEntregaLojaRepository.findById(areaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(areaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Area de entrega nao encontrada.");
    }

    @Test
    void deveRetornarAreaDaLojaQuandoExistir() {
        var areaId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var area = new AreaEntregaLoja();
        when(areaEntregaLojaRepository.findByIdAndLojaId(areaId, lojaId)).thenReturn(Optional.of(area));

        assertThat(service.validar(areaId, lojaId)).isEqualTo(area);
    }
}
