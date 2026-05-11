package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeGrupoComplementoDisponivelService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarGrupoComplementoServiceTest {

    @Mock
    private ComplementoValidator complementoValidator;
    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private ValidarNomeGrupoComplementoDisponivelService validarNomeGrupoComplementoDisponivelService;
    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private AtualizarGrupoComplementoService service;

    @Test
    void deveAtualizarGrupoComplemento() {
        var grupoId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var request = new AtualizarGrupoComplementoRequest("Molhos", null, 1, 3, 2, true);
        var loja = new Loja();
        loja.setId(lojaId);
        var grupo = new GrupoComplemento();
        grupo.setLoja(loja);
        var response = new AtualizarGrupoComplementoResponse(grupoId, lojaId, "Molhos", null, 1, 3, 2, true, null, null);
        when(validarGrupoComplementoExisteService.validar(grupoId)).thenReturn(grupo);
        when(grupoComplementoRepository.save(grupo)).thenReturn(grupo);
        when(complementoMapper.toAtualizarGrupoComplementoResponse(grupo)).thenReturn(response);

        var resultado = service.atualizar(grupoId, request);

        assertThat(resultado).isEqualTo(response);
        verify(complementoValidator).validarAtualizacaoGrupo(request);
        verify(validarNomeGrupoComplementoDisponivelService).validarAtualizacao(lojaId, grupoId, "Molhos");
        verify(complementoMapper).toEntity(request, grupo);
    }
}
