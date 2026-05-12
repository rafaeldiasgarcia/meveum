package br.com.meveum.crm.clientes.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.EnderecoClienteRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarEnderecoClienteExisteServiceTest {

    @Mock
    private EnderecoClienteRepository enderecoClienteRepository;
    @InjectMocks
    private ValidarEnderecoClienteExisteService service;

    @Test
    void deveRetornarEnderecoQuandoExistirParaCliente() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        var endereco = new EnderecoCliente();
        when(enderecoClienteRepository.findByIdAndClienteId(enderecoId, clienteId)).thenReturn(Optional.of(endereco));

        var resultado = service.validar(clienteId, enderecoId);

        assertThat(resultado).isEqualTo(endereco);
    }

    @Test
    void deveLancarErroQuandoEnderecoNaoExistirParaCliente() {
        var clienteId = UUID.randomUUID();
        var enderecoId = UUID.randomUUID();
        when(enderecoClienteRepository.findByIdAndClienteId(enderecoId, clienteId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(clienteId, enderecoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Endereco de cliente nao encontrado.");
    }
}
