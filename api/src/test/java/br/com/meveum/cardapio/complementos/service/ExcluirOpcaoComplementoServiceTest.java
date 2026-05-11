package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirOpcaoComplementoServiceTest {

    @Mock
    private ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;
    @InjectMocks
    private ExcluirOpcaoComplementoService service;

    @Test
    void deveInativarOpcaoComplemento() {
        var opcaoId = UUID.randomUUID();
        var opcao = new OpcaoComplemento();
        opcao.setActive(true);
        when(validarOpcaoComplementoExisteService.validar(opcaoId)).thenReturn(opcao);

        service.excluir(opcaoId);

        assertThat(opcao.getActive()).isFalse();
        verify(opcaoComplementoRepository).save(opcao);
    }
}
