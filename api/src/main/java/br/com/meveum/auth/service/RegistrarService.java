package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.RegistrarResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.auth.validator.service.ValidarEmailUsuarioLojaDisponivelService;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarSlugLojaDisponivelService;
import java.text.Normalizer;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrarService {

    private final AuthValidator authValidator;
    private final ValidarEmailUsuarioLojaDisponivelService validarEmailUsuarioLojaDisponivelService;
    private final ValidarSlugLojaDisponivelService validarSlugLojaDisponivelService;
    private final PasswordEncoder passwordEncoder;
    private final LojaRepository lojaRepository;
    private final UsuarioLojaRepository usuarioLojaRepository;
    private final GerarTokenUsuarioLojaService gerarTokenUsuarioLojaService;
    private final AuthMapper authMapper;

    @Transactional
    public RegistrarResponse registrar(RegistrarRequest request) {
        authValidator.validarRegistro(request);
        var email = request.email().trim().toLowerCase();
        var slug = gerarSlug(request.nomeLoja());
        var whatsappNumber = somenteDigitos(request.telefone());

        validarEmailUsuarioLojaDisponivelService.validar(email);
        validarSlugLojaDisponivelService.validar(slug);

        var loja = authMapper.toEntity(request, slug, whatsappNumber);
        loja = lojaRepository.save(loja);

        var passwordHash = passwordEncoder.encode(request.senha());
        var usuario = authMapper.toEntity(request, passwordHash);
        usuario.setLoja(loja);
        usuario = usuarioLojaRepository.save(usuario);

        var token = gerarTokenUsuarioLojaService.gerar(usuario);
        return authMapper.toRegistrarResponse(usuario, token);
    }

    private String gerarSlug(String nomeLoja) {
        var normalized = Normalizer.normalize(nomeLoja.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD);
        var slug = normalized
            .replaceAll("\\p{M}", "")
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
        return slug.isBlank() ? "loja" : slug;
    }

    private String somenteDigitos(String valor) {
        return valor.replaceAll("\\D", "");
    }
}
