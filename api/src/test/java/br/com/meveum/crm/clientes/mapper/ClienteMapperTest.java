package br.com.meveum.crm.clientes.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.projection.ClienteEstatisticaProjection;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ClienteMapperTest {

    private final ClienteMapper clienteMapper = new ClienteMapper();

    @Test
    void deveConverterCriarClienteRequestParaEntity() {
        var request = new CriarClienteRequest(UUID.randomUUID(), "Rafael", "11999999999");

        var cliente = clienteMapper.toEntity(request);

        assertThat(cliente.getLoja()).isNull();
        assertThat(cliente.getName()).isEqualTo("Rafael");
        assertThat(cliente.getPhone()).isEqualTo("11999999999");
    }

    @Test
    void deveConverterClienteParaResponses() {
        var cliente = cliente();

        assertThat(clienteMapper.toCriarClienteResponse(cliente).id()).isEqualTo(cliente.getId());
        assertThat(clienteMapper.toDetalharClienteResponse(cliente).telefone()).isEqualTo(cliente.getPhone());
        assertThat(clienteMapper.toAtualizarClienteResponse(cliente).nome()).isEqualTo(cliente.getName());
    }

    @Test
    void deveConverterClienteEstatisticaParaListarResponse() {
        var lojaId = UUID.randomUUID();
        var ultimoPedido = OffsetDateTime.now();
        var criadoEm = ultimoPedido.minusDays(10);
        var projection = new ClienteEstatisticaProjectionStub(
            UUID.randomUUID(),
            lojaId,
            "Rafael",
            "11999999999",
            3L,
            BigDecimal.valueOf(150),
            ultimoPedido,
            criadoEm
        );

        var response = clienteMapper.toListarClienteResponse(projection);

        assertThat(response.lojaId()).isEqualTo(lojaId);
        assertThat(response.totalPedidos()).isEqualTo(3L);
        assertThat(response.totalGasto()).isEqualTo(BigDecimal.valueOf(150));
        assertThat(response.ultimoPedido()).isEqualTo(ultimoPedido);
    }

    @Test
    void deveAtualizarClienteComRequest() {
        var cliente = cliente();
        var request = new AtualizarClienteRequest("Bruno", "11888888888");

        clienteMapper.toEntity(request, cliente);

        assertThat(cliente.getName()).isEqualTo("Bruno");
        assertThat(cliente.getPhone()).isEqualTo("11888888888");
    }

    @Test
    void deveConverterCriarEnderecoRequestParaEntity() {
        var request = criarEnderecoRequest();

        var endereco = clienteMapper.toEntity(request);

        assertThat(endereco.getCliente()).isNull();
        assertThat(endereco.getStreet()).isEqualTo("Rua A");
        assertThat(endereco.getLatitude()).isEqualTo(BigDecimal.valueOf(-23.55));
    }

    @Test
    void deveConverterEnderecoParaResponses() {
        var endereco = endereco();

        assertThat(clienteMapper.toCriarEnderecoClienteResponse(endereco).id()).isEqualTo(endereco.getId());
        assertThat(clienteMapper.toListarEnderecoClienteResponse(endereco).clienteId()).isEqualTo(endereco.getCliente().getId());
        assertThat(clienteMapper.toDetalharEnderecoClienteResponse(endereco).rua()).isEqualTo(endereco.getStreet());
        assertThat(clienteMapper.toAtualizarEnderecoClienteResponse(endereco).cep()).isEqualTo(endereco.getZipCode());
    }

    @Test
    void deveAtualizarEnderecoComRequest() {
        var endereco = endereco();
        var request = new AtualizarEnderecoClienteRequest("Casa", "Rua B", "20", "Fundos", "Centro", "Sao Paulo", "SP", "01000-001", "Portao azul", BigDecimal.ONE, BigDecimal.TEN);

        clienteMapper.toEntity(request, endereco);

        assertThat(endereco.getLabel()).isEqualTo("Casa");
        assertThat(endereco.getStreet()).isEqualTo("Rua B");
        assertThat(endereco.getNumber()).isEqualTo("20");
        assertThat(endereco.getReference()).isEqualTo("Portao azul");
        assertThat(endereco.getLongitude()).isEqualTo(BigDecimal.TEN);
    }

    private CriarEnderecoClienteRequest criarEnderecoRequest() {
        return new CriarEnderecoClienteRequest("Casa", "Rua A", "10", "Apto 1", "Centro", "Sao Paulo", "SP", "01000-000", "Perto da praca", BigDecimal.valueOf(-23.55), BigDecimal.valueOf(-46.63));
    }

    private Cliente cliente() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        return Cliente.builder()
            .id(UUID.randomUUID())
            .loja(loja)
            .name("Rafael")
            .phone("11999999999")
            .build();
    }

    private EnderecoCliente endereco() {
        return EnderecoCliente.builder()
            .id(UUID.randomUUID())
            .cliente(cliente())
            .label("Casa")
            .street("Rua A")
            .number("10")
            .complement("Apto 1")
            .neighborhood("Centro")
            .city("Sao Paulo")
            .state("SP")
            .zipCode("01000-000")
            .reference("Perto da praca")
            .latitude(BigDecimal.valueOf(-23.55))
            .longitude(BigDecimal.valueOf(-46.63))
            .build();
    }

    private record ClienteEstatisticaProjectionStub(
        UUID id,
        UUID lojaId,
        String nome,
        String telefone,
        Long totalPedidos,
        BigDecimal totalGasto,
        OffsetDateTime ultimoPedido,
        OffsetDateTime criadoEm
    ) implements ClienteEstatisticaProjection {

        @Override
        public UUID getId() {
            return id;
        }

        @Override
        public UUID getLojaId() {
            return lojaId;
        }

        @Override
        public String getNome() {
            return nome;
        }

        @Override
        public String getTelefone() {
            return telefone;
        }

        @Override
        public Long getTotalPedidos() {
            return totalPedidos;
        }

        @Override
        public BigDecimal getTotalGasto() {
            return totalGasto;
        }

        @Override
        public OffsetDateTime getUltimoPedido() {
            return ultimoPedido;
        }

        @Override
        public OffsetDateTime getCriadoEm() {
            return criadoEm;
        }
    }
}
