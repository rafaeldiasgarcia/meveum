package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.DetalharGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharGrupoComplementoServiceTest {

    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private ComplementoMapper complementoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private DetalharGrupoComplementoService service;

    @Test
    void deveDetalharGrupoComplemento() {
        var grupoId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var grupo = new GrupoComplemento();
        grupo.setLoja(loja);
        var response = new DetalharGrupoComplementoResponse(grupoId, UUID.randomUUID(), "Bebidas", null, 0, 2, 1, true, null, null);
        when(validarGrupoComplementoExisteService.validar(grupoId)).thenReturn(grupo);
        when(complementoMapper.toDetalharGrupoComplementoResponse(grupo)).thenReturn(response);

        assertThat(service.detalhar(grupoId)).isEqualTo(response);
    }
}
