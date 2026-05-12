package br.com.meveum.crm.clientes.validator;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class ClienteValidator {

    private static final BigDecimal LATITUDE_MINIMA = BigDecimal.valueOf(-90);
    private static final BigDecimal LATITUDE_MAXIMA = BigDecimal.valueOf(90);
    private static final BigDecimal LONGITUDE_MINIMA = BigDecimal.valueOf(-180);
    private static final BigDecimal LONGITUDE_MAXIMA = BigDecimal.valueOf(180);

    public void validarCriacao(CriarClienteRequest request) {
        validarNome(request.nome());
        validarTelefone(request.telefone());
    }

    public void validarAtualizacao(AtualizarClienteRequest request) {
        validarNome(request.nome());
        validarTelefone(request.telefone());
    }

    public void validarCriacaoEndereco(CriarEnderecoClienteRequest request) {
        validarEndereco(request.rua(), request.numero(), request.bairro(), request.cidade(), request.estado(), request.latitude(), request.longitude());
    }

    public void validarAtualizacaoEndereco(AtualizarEnderecoClienteRequest request) {
        validarEndereco(request.rua(), request.numero(), request.bairro(), request.cidade(), request.estado(), request.latitude(), request.longitude());
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do cliente e obrigatorio.");
        }
    }

    private void validarTelefone(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            throw new RegraNegocioException("Telefone do cliente e obrigatorio.");
        }
    }

    private void validarEndereco(
        String rua,
        String numero,
        String bairro,
        String cidade,
        String estado,
        BigDecimal latitude,
        BigDecimal longitude
    ) {
        if (rua == null || rua.isBlank()) {
            throw new RegraNegocioException("Rua do endereco e obrigatoria.");
        }

        if (numero == null || numero.isBlank()) {
            throw new RegraNegocioException("Numero do endereco e obrigatorio.");
        }

        if (bairro == null || bairro.isBlank()) {
            throw new RegraNegocioException("Bairro do endereco e obrigatorio.");
        }

        if (cidade == null || cidade.isBlank()) {
            throw new RegraNegocioException("Cidade do endereco e obrigatoria.");
        }

        if (estado == null || estado.isBlank()) {
            throw new RegraNegocioException("Estado do endereco e obrigatorio.");
        }

        if (estado.length() != 2) {
            throw new RegraNegocioException("Estado do endereco deve ter 2 caracteres.");
        }

        validarLatitude(latitude);
        validarLongitude(longitude);
    }

    private void validarLatitude(BigDecimal latitude) {
        if (latitude != null && (latitude.compareTo(LATITUDE_MINIMA) < 0 || latitude.compareTo(LATITUDE_MAXIMA) > 0)) {
            throw new RegraNegocioException("Latitude do endereco deve estar entre -90 e 90.");
        }
    }

    private void validarLongitude(BigDecimal longitude) {
        if (longitude != null && (longitude.compareTo(LONGITUDE_MINIMA) < 0 || longitude.compareTo(LONGITUDE_MAXIMA) > 0)) {
            throw new RegraNegocioException("Longitude do endereco deve estar entre -180 e 180.");
        }
    }
}
