package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.lojas.validator.service.ValidarSlugLojaDisponivelService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarLojaServiceTest {

    @Mock
    private LojaValidator lojaValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarSlugLojaDisponivelService validarSlugLojaDisponivelService;
    @Mock
    private LojaRepository lojaRepository;
    @Mock
    private LojaMapper lojaMapper;
    @InjectMocks
    private AtualizarLojaService service;

    @Test
    void deveAtualizarLoja() {
        var lojaId = UUID.randomUUID();
        var request = new AtualizarLojaRequest("Loja", "loja", null, "5511999999999");
        var loja = new Loja();
        var response = AtualizarLojaResponse.builder().id(lojaId).slug("loja").build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(lojaRepository.save(loja)).thenReturn(loja);
        when(lojaMapper.toAtualizarLojaResponse(loja)).thenReturn(response);

        var resultado = service.atualizar(lojaId, request);

        assertThat(resultado).isEqualTo(response);
        verify(lojaValidator).validarAtualizacao(request);
        verify(validarSlugLojaDisponivelService).validarAtualizacao(lojaId, "loja");
        verify(lojaMapper).toEntity(request, loja);
    }
}
