package br.com.meveum.crm.clientes.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarClienteExisteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;
    @InjectMocks
    private ValidarClienteExisteService service;

    @Test
    void deveRetornarClienteQuandoExistir() {
        var clienteId = UUID.randomUUID();
        var cliente = new Cliente();
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));

        var resultado = service.validar(clienteId);

        assertThat(resultado).isEqualTo(cliente);
    }

    @Test
    void deveLancarErroQuandoClienteNaoExistir() {
        var clienteId = UUID.randomUUID();
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(clienteId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Cliente nao encontrado.");
    }
}
