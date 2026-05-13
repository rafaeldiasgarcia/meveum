package br.com.meveum.auth.validator.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class ValidarAcessoLojaServiceTest {

    @Mock
    private ObterUsuarioAutenticadoService obterUsuarioAutenticadoService;
    @InjectMocks
    private ValidarAcessoLojaService service;

    @Test
    void devePermitirAcessoQuandoLojaPertenceAoUsuario() {
        var lojaId = UUID.randomUUID();
        when(obterUsuarioAutenticadoService.getUsuarioAutenticado()).thenReturn(usuario(lojaId));

        service.validar(lojaId);
    }

    @Test
    void deveRecusarAcessoQuandoLojaNaoPertenceAoUsuario() {
        var lojaId = UUID.randomUUID();
        when(obterUsuarioAutenticadoService.getUsuarioAutenticado()).thenReturn(usuario(UUID.randomUUID()));

        assertThatThrownBy(() -> service.validar(lojaId))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessage("Acesso negado.");
    }

    private UsuarioLoja usuario(UUID lojaId) {
        var loja = new Loja();
        loja.setId(lojaId);

        var usuario = new UsuarioLoja();
        usuario.setLoja(loja);
        return usuario;
    }
}
