package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
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
class CriarGrupoComplementoServiceTest {

    @Mock
    private ComplementoValidator complementoValidator;
    @Mock
    private ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    @Mock
    private ValidarNomeGrupoComplementoDisponivelService validarNomeGrupoComplementoDisponivelService;
    @Mock
    private GrupoComplementoRepository grupoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private CriarGrupoComplementoService service;

    @Test
    void deveCriarGrupoComplemento() {
        var lojaId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var request = new CriarGrupoComplementoRequest(lojaId, "Bebidas", null, 0, 2, 1);
        var loja = new Loja();
        loja.setId(lojaId);
        var grupo = new GrupoComplemento();
        var grupoSalvo = new GrupoComplemento();
        grupoSalvo.setId(grupoId);
        var response = new CriarGrupoComplementoResponse(grupoId, lojaId, "Bebidas", null, 0, 2, 1, true, null, null);

        when(validarLojaComplementoExisteService.validar(lojaId)).thenReturn(loja);
        when(complementoMapper.toEntity(request)).thenReturn(grupo);
        when(grupoComplementoRepository.save(grupo)).thenReturn(grupoSalvo);
        when(complementoMapper.toCriarGrupoComplementoResponse(grupoSalvo)).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(grupo.getLoja()).isEqualTo(loja);
        verify(complementoValidator).validarCriacaoGrupo(request);
        verify(validarNomeGrupoComplementoDisponivelService).validarCriacao(lojaId, "Bebidas");
    }
}
