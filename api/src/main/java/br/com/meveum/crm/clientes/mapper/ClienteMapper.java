package br.com.meveum.crm.clientes.mapper;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarClienteResponse;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteResponse;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.DetalharClienteResponse;
import br.com.meveum.crm.clientes.dto.DetalharEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.ListarClienteResponse;
import br.com.meveum.crm.clientes.dto.ListarEnderecoClienteResponse;
import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.entity.EnderecoCliente;
import br.com.meveum.crm.repository.projection.ClienteEstatisticaProjection;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(CriarClienteRequest request) {
        return Cliente.builder()
            .name(request.nome())
            .phone(request.telefone())
            .build();
    }

    public CriarClienteResponse toCriarClienteResponse(Cliente cliente) {
        return CriarClienteResponse.builder()
            .id(cliente.getId())
            .lojaId(cliente.getLoja().getId())
            .nome(cliente.getName())
            .telefone(cliente.getPhone())
            .criadoEm(cliente.getCreatedAt())
            .atualizadoEm(cliente.getUpdatedAt())
            .build();
    }

    public ListarClienteResponse toListarClienteResponse(Cliente cliente) {
        return ListarClienteResponse.builder()
            .id(cliente.getId())
            .lojaId(cliente.getLoja().getId())
            .nome(cliente.getName())
            .telefone(cliente.getPhone())
            .totalPedidos(0L)
            .totalGasto(BigDecimal.ZERO)
            .ultimoPedido(null)
            .criadoEm(cliente.getCreatedAt())
            .build();
    }

    public ListarClienteResponse toListarClienteResponse(ClienteEstatisticaProjection projection) {
        return ListarClienteResponse.builder()
            .id(projection.getId())
            .lojaId(projection.getLojaId())
            .nome(projection.getNome())
            .telefone(projection.getTelefone())
            .totalPedidos(projection.getTotalPedidos())
            .totalGasto(projection.getTotalGasto())
            .ultimoPedido(projection.getUltimoPedido())
            .criadoEm(projection.getCriadoEm())
            .build();
    }

    public DetalharClienteResponse toDetalharClienteResponse(Cliente cliente) {
        return DetalharClienteResponse.builder()
            .id(cliente.getId())
            .lojaId(cliente.getLoja().getId())
            .nome(cliente.getName())
            .telefone(cliente.getPhone())
            .criadoEm(cliente.getCreatedAt())
            .atualizadoEm(cliente.getUpdatedAt())
            .build();
    }

    public AtualizarClienteResponse toAtualizarClienteResponse(Cliente cliente) {
        return AtualizarClienteResponse.builder()
            .id(cliente.getId())
            .lojaId(cliente.getLoja().getId())
            .nome(cliente.getName())
            .telefone(cliente.getPhone())
            .criadoEm(cliente.getCreatedAt())
            .atualizadoEm(cliente.getUpdatedAt())
            .build();
    }

    public void toEntity(AtualizarClienteRequest request, Cliente cliente) {
        cliente.setName(request.nome());
        cliente.setPhone(request.telefone());
    }

    public EnderecoCliente toEntity(CriarEnderecoClienteRequest request) {
        return EnderecoCliente.builder()
            .label(request.rotulo())
            .street(request.rua())
            .number(request.numero())
            .complement(request.complemento())
            .neighborhood(request.bairro())
            .city(request.cidade())
            .state(request.estado())
            .zipCode(request.cep())
            .reference(request.referencia())
            .latitude(request.latitude())
            .longitude(request.longitude())
            .build();
    }

    public CriarEnderecoClienteResponse toCriarEnderecoClienteResponse(EnderecoCliente endereco) {
        return CriarEnderecoClienteResponse.builder()
            .id(endereco.getId())
            .clienteId(endereco.getCliente().getId())
            .rotulo(endereco.getLabel())
            .rua(endereco.getStreet())
            .numero(endereco.getNumber())
            .complemento(endereco.getComplement())
            .bairro(endereco.getNeighborhood())
            .cidade(endereco.getCity())
            .estado(endereco.getState())
            .cep(endereco.getZipCode())
            .referencia(endereco.getReference())
            .latitude(endereco.getLatitude())
            .longitude(endereco.getLongitude())
            .build();
    }

    public ListarEnderecoClienteResponse toListarEnderecoClienteResponse(EnderecoCliente endereco) {
        return ListarEnderecoClienteResponse.builder()
            .id(endereco.getId())
            .clienteId(endereco.getCliente().getId())
            .rotulo(endereco.getLabel())
            .rua(endereco.getStreet())
            .numero(endereco.getNumber())
            .bairro(endereco.getNeighborhood())
            .cidade(endereco.getCity())
            .estado(endereco.getState())
            .cep(endereco.getZipCode())
            .build();
    }

    public DetalharEnderecoClienteResponse toDetalharEnderecoClienteResponse(EnderecoCliente endereco) {
        return DetalharEnderecoClienteResponse.builder()
            .id(endereco.getId())
            .clienteId(endereco.getCliente().getId())
            .rotulo(endereco.getLabel())
            .rua(endereco.getStreet())
            .numero(endereco.getNumber())
            .complemento(endereco.getComplement())
            .bairro(endereco.getNeighborhood())
            .cidade(endereco.getCity())
            .estado(endereco.getState())
            .cep(endereco.getZipCode())
            .referencia(endereco.getReference())
            .latitude(endereco.getLatitude())
            .longitude(endereco.getLongitude())
            .build();
    }

    public AtualizarEnderecoClienteResponse toAtualizarEnderecoClienteResponse(EnderecoCliente endereco) {
        return AtualizarEnderecoClienteResponse.builder()
            .id(endereco.getId())
            .clienteId(endereco.getCliente().getId())
            .rotulo(endereco.getLabel())
            .rua(endereco.getStreet())
            .numero(endereco.getNumber())
            .complemento(endereco.getComplement())
            .bairro(endereco.getNeighborhood())
            .cidade(endereco.getCity())
            .estado(endereco.getState())
            .cep(endereco.getZipCode())
            .referencia(endereco.getReference())
            .latitude(endereco.getLatitude())
            .longitude(endereco.getLongitude())
            .build();
    }

    public void toEntity(AtualizarEnderecoClienteRequest request, EnderecoCliente endereco) {
        endereco.setLabel(request.rotulo());
        endereco.setStreet(request.rua());
        endereco.setNumber(request.numero());
        endereco.setComplement(request.complemento());
        endereco.setNeighborhood(request.bairro());
        endereco.setCity(request.cidade());
        endereco.setState(request.estado());
        endereco.setZipCode(request.cep());
        endereco.setReference(request.referencia());
        endereco.setLatitude(request.latitude());
        endereco.setLongitude(request.longitude());
    }
}
