package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeOpcaoComplementoDisponivelService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarOpcaoComplementoServiceTest {

    @Mock
    private ComplementoValidator complementoValidator;
    @Mock
    private ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private ValidarNomeOpcaoComplementoDisponivelService validarNomeOpcaoComplementoDisponivelService;
    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private CriarOpcaoComplementoService service;

    @Test
    void deveCriarOpcaoComplemento() {
        var lojaId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        var request = new CriarOpcaoComplementoRequest(lojaId, grupoId, "Coca", null, BigDecimal.TEN, 1);
        var loja = new Loja();
        var grupo = new GrupoComplemento();
        var opcao = new OpcaoComplemento();
        var opcaoSalva = new OpcaoComplemento();
        opcaoSalva.setId(opcaoId);
        var response = new CriarOpcaoComplementoResponse(opcaoId, lojaId, grupoId, "Coca", null, BigDecimal.TEN, 1, true);
        when(validarLojaComplementoExisteService.validar(lojaId)).thenReturn(loja);
        when(validarGrupoComplementoExisteService.validarAtivo(grupoId, lojaId)).thenReturn(grupo);
        when(complementoMapper.toEntity(request)).thenReturn(opcao);
        when(opcaoComplementoRepository.save(opcao)).thenReturn(opcaoSalva);
        when(complementoMapper.toCriarOpcaoComplementoResponse(opcaoSalva)).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(opcao.getLoja()).isEqualTo(loja);
        assertThat(opcao.getGrupoComplemento()).isEqualTo(grupo);
        verify(complementoValidator).validarCriacaoOpcao(request);
        verify(validarNomeOpcaoComplementoDisponivelService).validarCriacao(grupoId, "Coca");
    }
}
