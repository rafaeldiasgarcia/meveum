package br.com.meveum.crm.clientes.validator.service;

import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarTelefoneClienteDisponivelService {

    private final ClienteRepository clienteRepository;

    public void validarCriacao(UUID lojaId, String telefone) {
        if (clienteRepository.existsByLojaIdAndPhone(lojaId, telefone)) {
            throw new RegraNegocioException("Loja ja possui cliente com esse telefone.");
        }
    }

    public void validarAtualizacao(UUID lojaId, UUID clienteId, String telefone) {
        if (clienteRepository.existsByLojaIdAndPhoneAndIdNot(lojaId, telefone, clienteId)) {
            throw new RegraNegocioException("Loja ja possui cliente com esse telefone.");
        }
    }
}
