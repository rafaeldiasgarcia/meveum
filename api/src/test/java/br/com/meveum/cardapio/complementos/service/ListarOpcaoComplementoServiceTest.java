package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.ListarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarOpcaoComplementoServiceTest {

    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private ListarOpcaoComplementoService service;

    @Test
    void deveListarOpcoesDoGrupo() {
        var grupoId = UUID.randomUUID();
        var opcao = new OpcaoComplemento();
        var response = new ListarOpcaoComplementoResponse(UUID.randomUUID(), UUID.randomUUID(), grupoId, "Coca", null, BigDecimal.TEN, 1, true);
        when(opcaoComplementoRepository.findByGrupoComplementoIdOrderBySortOrderAsc(grupoId)).thenReturn(List.of(opcao));
        when(complementoMapper.toListarOpcaoComplementoResponse(opcao)).thenReturn(response);

        var resultado = service.listar(grupoId);

        assertThat(resultado).containsExactly(response);
        verify(validarGrupoComplementoExisteService).validar(grupoId);
    }
}
