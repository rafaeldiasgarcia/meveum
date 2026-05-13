package br.com.meveum.auth.validator.service;

import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarEmailUsuarioLojaDisponivelService {

    private final UsuarioLojaRepository usuarioLojaRepository;

    public void validar(String email) {
        if (usuarioLojaRepository.existsByEmailIgnoreCase(email)) {
            throw new RegraNegocioException("Ja existe um usuario com esse email.");
        }
    }
}
