package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarGrupoComplementoServiceTest {

    @Mock
    private ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private ListarGrupoComplementoService service;

    @Test
    void deveListarGruposDaLoja() {
        var lojaId = UUID.randomUUID();
        var grupo = new GrupoComplemento();
        var response = new ListarGrupoComplementoResponse(UUID.randomUUID(), lojaId, "Bebidas", null, 0, 2, 1, true);
        when(grupoComplementoRepository.findByLojaIdOrderBySortOrderAsc(lojaId)).thenReturn(List.of(grupo));
        when(complementoMapper.toListarGrupoComplementoResponse(grupo)).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaComplementoExisteService).validar(lojaId);
    }
}
