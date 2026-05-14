package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
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
class AtualizarStatusLojaServiceTest {

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
    private AtualizarStatusLojaService service;

    @Test
    void deveAtualizarStatus() {
        var lojaId = UUID.randomUUID();
        var request = new AtualizarStatusLojaRequest(LojaStatus.INACTIVE);
        var loja = new Loja();
        var response = AtualizarStatusLojaResponse.builder().id(lojaId).status(LojaStatus.INACTIVE).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(lojaRepository.save(loja)).thenReturn(loja);
        when(lojaMapper.toAtualizarStatusLojaResponse(loja)).thenReturn(response);

        var resultado = service.atualizar(lojaId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(loja.getStatus()).isEqualTo(LojaStatus.INACTIVE);
        verify(lojaValidator).validarStatus(request);
    }
}
