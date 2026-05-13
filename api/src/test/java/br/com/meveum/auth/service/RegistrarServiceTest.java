package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.RegistrarResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.auth.validator.service.ValidarEmailUsuarioLojaDisponivelService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarSlugLojaDisponivelService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class RegistrarServiceTest {

    @Mock
    private AuthValidator authValidator;
    @Mock
    private ValidarEmailUsuarioLojaDisponivelService validarEmailUsuarioLojaDisponivelService;
    @Mock
    private ValidarSlugLojaDisponivelService validarSlugLojaDisponivelService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private LojaRepository lojaRepository;
    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @Mock
    private GerarTokenUsuarioLojaService gerarTokenUsuarioLojaService;
    @Mock
    private AuthMapper authMapper;
    @InjectMocks
    private RegistrarService service;

    @Test
    void deveRegistrarLojaEUsuarioOwner() {
        var request = new RegistrarRequest("Rafael", "Meveum Acai", "(11) 99999-9999", " ADMIN@MEVEUM.COM ", "meveum123", "meveum123");
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var usuario = new UsuarioLoja();
        var response = RegistrarResponse.builder().token("token-jwt").build();
        when(authMapper.toEntity(request, "meveum-acai", "11999999999")).thenReturn(loja);
        when(lojaRepository.save(loja)).thenReturn(loja);
        when(passwordEncoder.encode("meveum123")).thenReturn("hash");
        when(authMapper.toEntity(request, "hash")).thenReturn(usuario);
        when(usuarioLojaRepository.save(usuario)).thenReturn(usuario);
        when(gerarTokenUsuarioLojaService.gerar(usuario)).thenReturn("token-jwt");
        when(authMapper.toRegistrarResponse(usuario, "token-jwt")).thenReturn(response);

        var resultado = service.registrar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(usuario.getLoja()).isEqualTo(loja);
        verify(authValidator).validarRegistro(request);
        verify(validarEmailUsuarioLojaDisponivelService).validar("admin@meveum.com");
        verify(validarSlugLojaDisponivelService).validar("meveum-acai");
    }
}
