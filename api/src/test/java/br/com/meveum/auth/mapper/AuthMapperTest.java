package br.com.meveum.auth.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.lojas.entity.enums.UsuarioLojaRole;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AuthMapperTest {

    private final AuthMapper authMapper = new AuthMapper();

    @Test
    void deveConverterUsuarioParaLoginResponse() {
        var usuario = usuario();

        var response = authMapper.toLoginResponse(usuario, "token-jwt");

        assertThat(response.token()).isEqualTo("token-jwt");
        assertThat(response.usuario().id()).isEqualTo(usuario.getId());
        assertThat(response.usuario().lojaId()).isEqualTo(usuario.getLoja().getId());
        assertThat(response.usuario().nome()).isEqualTo(usuario.getName());
        assertThat(response.usuario().email()).isEqualTo(usuario.getEmail());
        assertThat(response.usuario().role()).isEqualTo("OWNER");
    }

    @Test
    void deveConverterUsuarioParaRegistrarResponse() {
        var usuario = usuario();

        var response = authMapper.toRegistrarResponse(usuario, "token-jwt");

        assertThat(response.token()).isEqualTo("token-jwt");
        assertThat(response.usuario().email()).isEqualTo(usuario.getEmail());
    }

    @Test
    void deveConverterRegistrarRequestParaLoja() {
        var request = new RegistrarRequest("Rafael", " Loja Teste ", "11999999999", "admin@meveum.com", "meveum123", "meveum123");

        var loja = authMapper.toEntity(request, "loja-teste", "11999999999");

        assertThat(loja.getName()).isEqualTo("Loja Teste");
        assertThat(loja.getSlug()).isEqualTo("loja-teste");
        assertThat(loja.getWhatsappNumber()).isEqualTo("11999999999");
        assertThat(loja.getStatus()).isEqualTo(LojaStatus.ACTIVE);
        assertThat(loja.getManuallyPaused()).isFalse();
    }

    @Test
    void deveConverterRegistrarRequestParaUsuario() {
        var request = new RegistrarRequest(" Rafael ", "Loja Teste", "11999999999", " ADMIN@MEVEUM.COM ", "meveum123", "meveum123");

        var usuario = authMapper.toEntity(request, "hash");

        assertThat(usuario.getName()).isEqualTo("Rafael");
        assertThat(usuario.getEmail()).isEqualTo("admin@meveum.com");
        assertThat(usuario.getPasswordHash()).isEqualTo("hash");
        assertThat(usuario.getRole()).isEqualTo(UsuarioLojaRole.OWNER);
        assertThat(usuario.getActive()).isTrue();
    }

    @Test
    void deveConverterUsuarioParaObterUsuarioAutenticadoResponse() {
        var usuario = usuario();

        var response = authMapper.toObterUsuarioAutenticadoResponse(usuario);

        assertThat(response.id()).isEqualTo(usuario.getId());
        assertThat(response.lojaId()).isEqualTo(usuario.getLoja().getId());
        assertThat(response.nome()).isEqualTo(usuario.getName());
        assertThat(response.email()).isEqualTo(usuario.getEmail());
        assertThat(response.role()).isEqualTo("OWNER");
    }

    private UsuarioLoja usuario() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());

        var usuario = new UsuarioLoja();
        usuario.setId(UUID.randomUUID());
        usuario.setLoja(loja);
        usuario.setName("Admin Meveum");
        usuario.setEmail("admin@meveum.com");
        usuario.setRole(UsuarioLojaRole.OWNER);
        return usuario;
    }
}
