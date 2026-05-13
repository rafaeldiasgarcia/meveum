package br.com.meveum.shared.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${jwt.public.key}")
    private RSAPublicKey rsaPublicKey;

    @Value("${jwt.private.key}")
    private RSAPrivateKey rsaPrivateKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) ->
                    escreverErro(response, HttpStatus.UNAUTHORIZED, "Autenticacao obrigatoria.")
                )
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    escreverErro(response, HttpStatus.FORBIDDEN, "Acesso negado.")
                )
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/registrar").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/esqueci-senha", "/auth/redefinir-senha").permitAll()
                .requestMatchers(HttpMethod.GET, "/auth/oauth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/lojas/slug/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/categorias", "/produtos", "/complementos/opcoes").permitAll()
                .requestMatchers(HttpMethod.GET, "/complementos/produtos/*/grupos").permitAll()
                .requestMatchers(HttpMethod.GET, "/entrega/areas", "/pagamentos/formas").permitAll()
                .requestMatchers(HttpMethod.POST, "/clientes", "/clientes/*/enderecos", "/pedidos").permitAll()
                .requestMatchers(HttpMethod.GET, "/integracoes/whatsapp/pedidos/*/mensagem").permitAll()
                .requestMatchers(HttpMethod.POST, "/categorias", "/produtos", "/complementos/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/categorias/**", "/produtos/**", "/complementos/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/categorias/**", "/produtos/**", "/complementos/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.POST, "/entrega/areas", "/pagamentos/formas").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/entrega/areas/**", "/pagamentos/formas/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/entrega/areas/**", "/pagamentos/formas/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/lojas/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PATCH, "/lojas/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/dashboard/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/pedidos/**").hasAnyRole("OWNER", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PATCH, "/pedidos/**").hasAnyRole("OWNER", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.GET, "/clientes", "/clientes/**").hasAnyRole("OWNER", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/clientes/**").hasAnyRole("OWNER", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasAnyRole("OWNER", "MANAGER", "STAFF")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .build();
    }

    private void escreverErro(HttpServletResponse response, HttpStatus status, String mensagem) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("""
            {"mensagem":"%s","timestamp":"%s"}""".formatted(mensagem, OffsetDateTime.now()));
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        var grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(rsaPublicKey).privateKey(rsaPrivateKey).build();
        return new NimbusJwtEncoder(new ImmutableJWKSet<SecurityContext>(new JWKSet(jwk)));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
