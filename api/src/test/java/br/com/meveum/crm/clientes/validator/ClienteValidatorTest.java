package br.com.meveum.crm.clientes.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ClienteValidatorTest {

    private final ClienteValidator clienteValidator = new ClienteValidator();

    @Test
    void deveValidarClienteValido() {
        var request = new CriarClienteRequest(UUID.randomUUID(), "Rafael", "11999999999");

        assertThatCode(() -> clienteValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveValidarAtualizacaoClienteValida() {
        var request = new AtualizarClienteRequest("Rafael", "11999999999");

        assertThatCode(() -> clienteValidator.validarAtualizacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoNomeClienteNaoInformado() {
        var request = new CriarClienteRequest(UUID.randomUUID(), " ", "11999999999");

        assertThatThrownBy(() -> clienteValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome do cliente e obrigatorio.");
    }

    @Test
    void deveLancarErroQuandoTelefoneClienteNaoInformado() {
        var request = new CriarClienteRequest(UUID.randomUUID(), "Rafael", null);

        assertThatThrownBy(() -> clienteValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Telefone do cliente e obrigatorio.");
    }

    @Test
    void deveValidarEnderecoValido() {
        var request = criarEnderecoRequest(BigDecimal.valueOf(-23.55), BigDecimal.valueOf(-46.63));

        assertThatCode(() -> clienteValidator.validarCriacaoEndereco(request)).doesNotThrowAnyException();
    }

    @Test
    void deveValidarAtualizacaoEnderecoValida() {
        var request = new AtualizarEnderecoClienteRequest("Casa", "Rua A", "10", null, "Centro", "Sao Paulo", "SP", null, null, null, null);

        assertThatCode(() -> clienteValidator.validarAtualizacaoEndereco(request)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoRuaNaoInformada() {
        var request = new CriarEnderecoClienteRequest("Casa", " ", "10", null, "Centro", "Sao Paulo", "SP", null, null, null, null);

        assertThatThrownBy(() -> clienteValidator.validarCriacaoEndereco(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Rua do endereco e obrigatoria.");
    }

    @Test
    void deveLancarErroQuandoEstadoNaoTiverDoisCaracteres() {
        var request = new CriarEnderecoClienteRequest("Casa", "Rua A", "10", null, "Centro", "Sao Paulo", "SPO", null, null, null, null);

        assertThatThrownBy(() -> clienteValidator.validarCriacaoEndereco(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Estado do endereco deve ter 2 caracteres.");
    }

    @Test
    void deveLancarErroQuandoLatitudeForaDoIntervalo() {
        var request = criarEnderecoRequest(BigDecimal.valueOf(91), null);

        assertThatThrownBy(() -> clienteValidator.validarCriacaoEndereco(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Latitude do endereco deve estar entre -90 e 90.");
    }

    @Test
    void deveLancarErroQuandoLongitudeForaDoIntervalo() {
        var request = criarEnderecoRequest(null, BigDecimal.valueOf(-181));

        assertThatThrownBy(() -> clienteValidator.validarCriacaoEndereco(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Longitude do endereco deve estar entre -180 e 180.");
    }

    private CriarEnderecoClienteRequest criarEnderecoRequest(BigDecimal latitude, BigDecimal longitude) {
        return new CriarEnderecoClienteRequest("Casa", "Rua A", "10", null, "Centro", "Sao Paulo", "SP", null, null, latitude, longitude);
    }
}
