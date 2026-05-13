package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class ObterUrlOAuthServiceTest {

    private ObterUrlOAuthService service;

    @BeforeEach
    void setUp() {
        service = new ObterUrlOAuthService();
        ReflectionTestUtils.setField(service, "googleClientId", "google-client");
        ReflectionTestUtils.setField(service, "microsoftClientId", "microsoft-client");
        ReflectionTestUtils.setField(service, "appleClientId", "apple-client");
        ReflectionTestUtils.setField(service, "redirectBaseUrl", "http://localhost:8080");
    }

    @Test
    void deveMontarUrlDoGoogle() {
        var response = service.obter("google");

        assertThat(response.provedor()).isEqualTo("google");
        assertThat(response.authorizationUrl())
            .startsWith("https://accounts.google.com/o/oauth2/v2/auth")
            .contains("response_type=code")
            .contains("client_id=google-client")
            .contains("scope=openid+email+profile")
            .contains("redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Foauth%2Fgoogle%2Fcallback")
            .contains("state=");
    }

    @Test
    void deveMontarUrlDaMicrosoft() {
        var response = service.obter("microsoft");

        assertThat(response.provedor()).isEqualTo("microsoft");
        assertThat(response.authorizationUrl())
            .startsWith("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
            .contains("client_id=microsoft-client");
    }

    @Test
    void deveMontarUrlDaApple() {
        var response = service.obter("apple");

        assertThat(response.provedor()).isEqualTo("apple");
        assertThat(response.authorizationUrl())
            .startsWith("https://appleid.apple.com/auth/authorize")
            .contains("response_mode=form_post")
            .contains("client_id=apple-client");
    }

    @Test
    void deveFalharQuandoProvedorForInvalido() {
        assertThatThrownBy(() -> service.obter("github"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Provedor OAuth invalido.");
    }

    @Test
    void deveFalharQuandoProviderNaoEstiverConfigurado() {
        ReflectionTestUtils.setField(service, "googleClientId", "");

        assertThatThrownBy(() -> service.obter("google"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("OAuth com Google nao esta configurado.");
    }
}
