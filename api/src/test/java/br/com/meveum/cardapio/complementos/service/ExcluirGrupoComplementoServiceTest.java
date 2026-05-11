package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirGrupoComplementoServiceTest {

    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;
    @InjectMocks
    private ExcluirGrupoComplementoService service;

    @Test
    void deveInativarGrupoComplemento() {
        var grupoId = UUID.randomUUID();
        var grupo = new GrupoComplemento();
        grupo.setActive(true);
        when(validarGrupoComplementoExisteService.validar(grupoId)).thenReturn(grupo);

        service.excluir(grupoId);

        assertThat(grupo.getActive()).isFalse();
        verify(grupoComplementoRepository).save(grupo);
    }
}
