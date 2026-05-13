package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.ObterUrlOAuthResponse;
import br.com.meveum.auth.entity.enums.OAuthProvider;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ObterUrlOAuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${meveum.oauth.google.client-id:}")
    private String googleClientId;

    @Value("${meveum.oauth.microsoft.client-id:}")
    private String microsoftClientId;

    @Value("${meveum.oauth.apple.client-id:}")
    private String appleClientId;

    @Value("${meveum.oauth.redirect-base-url:http://localhost:8080}")
    private String redirectBaseUrl;

    public ObterUrlOAuthResponse obter(String provedor) {
        var provider = obterProvider(provedor);
        var clientId = obterClientId(provider);

        if (clientId == null || clientId.isBlank()) {
            throw new RegraNegocioException("OAuth com " + provider.getLabel() + " nao esta configurado.");
        }

        return ObterUrlOAuthResponse.builder()
            .provedor(provider.getSlug())
            .authorizationUrl(montarUrl(provider, clientId))
            .build();
    }

    private OAuthProvider obterProvider(String provedor) {
        try {
            return OAuthProvider.fromSlug(provedor);
        } catch (IllegalArgumentException exception) {
            throw new RegraNegocioException("Provedor OAuth invalido.");
        }
    }

    private String obterClientId(OAuthProvider provider) {
        return switch (provider) {
            case GOOGLE -> googleClientId;
            case MICROSOFT -> microsoftClientId;
            case APPLE -> appleClientId;
        };
    }

    private String montarUrl(OAuthProvider provider, String clientId) {
        var redirectUri = redirectBaseUrl + "/auth/oauth/" + provider.getSlug() + "/callback";
        var state = gerarState();
        return switch (provider) {
            case GOOGLE -> "https://accounts.google.com/o/oauth2/v2/auth"
                + "?response_type=code"
                + "&client_id=" + encode(clientId)
                + "&redirect_uri=" + encode(redirectUri)
                + "&scope=" + encode("openid email profile")
                + "&state=" + state;
            case MICROSOFT -> "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
                + "?response_type=code"
                + "&client_id=" + encode(clientId)
                + "&redirect_uri=" + encode(redirectUri)
                + "&scope=" + encode("openid email profile")
                + "&state=" + state;
            case APPLE -> "https://appleid.apple.com/auth/authorize"
                + "?response_type=code"
                + "&response_mode=form_post"
                + "&client_id=" + encode(clientId)
                + "&redirect_uri=" + encode(redirectUri)
                + "&scope=" + encode("name email")
                + "&state=" + state;
        };
    }

    private String gerarState() {
        var bytes = new byte[16];
        SECURE_RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String encode(String valor) {
        return URLEncoder.encode(valor, StandardCharsets.UTF_8);
    }
}
