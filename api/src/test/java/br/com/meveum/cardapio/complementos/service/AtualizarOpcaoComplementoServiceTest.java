package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeOpcaoComplementoDisponivelService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
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
class AtualizarOpcaoComplementoServiceTest {

    @Mock
    private ComplementoValidator complementoValidator;
    @Mock
    private ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    @Mock
    private ValidarNomeOpcaoComplementoDisponivelService validarNomeOpcaoComplementoDisponivelService;
    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private AtualizarOpcaoComplementoService service;

    @Test
    void deveAtualizarOpcaoComplemento() {
        var opcaoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var request = new AtualizarOpcaoComplementoRequest("Pepsi", null, BigDecimal.ONE, 2, true);
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var grupo = new GrupoComplemento();
        grupo.setId(grupoId);
        grupo.setLoja(loja);
        var opcao = new OpcaoComplemento();
        opcao.setLoja(loja);
        opcao.setGrupoComplemento(grupo);
        var response = new AtualizarOpcaoComplementoResponse(opcaoId, UUID.randomUUID(), grupoId, "Pepsi", null, BigDecimal.ONE, 2, true);
        when(validarOpcaoComplementoExisteService.validar(opcaoId)).thenReturn(opcao);
        when(opcaoComplementoRepository.save(opcao)).thenReturn(opcao);
        when(complementoMapper.toAtualizarOpcaoComplementoResponse(opcao)).thenReturn(response);

        var resultado = service.atualizar(opcaoId, request);

        assertThat(resultado).isEqualTo(response);
        verify(complementoValidator).validarAtualizacaoOpcao(request);
        verify(validarNomeOpcaoComplementoDisponivelService).validarAtualizacao(grupoId, opcaoId, "Pepsi");
        verify(complementoMapper).toEntity(request, opcao);
    }
}
