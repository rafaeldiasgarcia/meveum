package br.com.meveum.crm.clientes.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarTelefoneClienteDisponivelServiceTest {

    @Mock
    private ClienteRepository clienteRepository;
    @InjectMocks
    private ValidarTelefoneClienteDisponivelService service;

    @Test
    void devePermitirCriacaoQuandoTelefoneDisponivel() {
        var lojaId = UUID.randomUUID();
        when(clienteRepository.existsByLojaIdAndPhone(lojaId, "11999999999")).thenReturn(false);

        assertThatCode(() -> service.validarCriacao(lojaId, "11999999999")).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoTelefoneJaExistirNaCriacao() {
        var lojaId = UUID.randomUUID();
        when(clienteRepository.existsByLojaIdAndPhone(lojaId, "11999999999")).thenReturn(true);

        assertThatThrownBy(() -> service.validarCriacao(lojaId, "11999999999"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja ja possui cliente com esse telefone.");
    }

    @Test
    void deveLancarErroQuandoTelefoneJaExistirNaAtualizacao() {
        var lojaId = UUID.randomUUID();
        var clienteId = UUID.randomUUID();
        when(clienteRepository.existsByLojaIdAndPhoneAndIdNot(lojaId, "11999999999", clienteId)).thenReturn(true);

        assertThatThrownBy(() -> service.validarAtualizacao(lojaId, clienteId, "11999999999"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja ja possui cliente com esse telefone.");
    }
}
