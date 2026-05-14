package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarPausaManualLojaServiceTest {

    @Mock
    private LojaValidator lojaValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private LojaRepository lojaRepository;
    @Mock
    private LojaMapper lojaMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private AtualizarPausaManualLojaService service;

    @Test
    void deveAtualizarPausaManual() {
        var lojaId = UUID.randomUUID();
        var request = new AtualizarPausaManualLojaRequest(true);
        var loja = new Loja();
        var response = AtualizarPausaManualLojaResponse.builder().id(lojaId).pausadaManualmente(true).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(lojaRepository.save(loja)).thenReturn(loja);
        when(lojaMapper.toAtualizarPausaManualLojaResponse(loja)).thenReturn(response);

        var resultado = service.atualizar(lojaId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(loja.getManuallyPaused()).isTrue();
        verify(lojaValidator).validarPausaManual(request);
    }
}
