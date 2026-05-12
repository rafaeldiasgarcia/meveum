package br.com.meveum.entrega.areas.mapper;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.DetalharAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.ListarAreaEntregaResponse;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import org.springframework.stereotype.Component;

@Component
public class AreaEntregaMapper {

    public AreaEntregaLoja toEntity(CriarAreaEntregaRequest request) {
        return AreaEntregaLoja.builder()
            .name(request.nome())
            .type(request.tipo())
            .neighborhood(request.bairro())
            .zipCodeStart(request.cepInicial())
            .zipCodeEnd(request.cepFinal())
            .radiusKm(request.raioKm())
            .fee(request.taxa())
            .minimumOrderValue(request.pedidoMinimo())
            .estimatedMinutes(request.tempoEstimadoMinutos())
            .active(true)
            .build();
    }

    public CriarAreaEntregaResponse toCriarAreaEntregaResponse(AreaEntregaLoja areaEntrega) {
        return CriarAreaEntregaResponse.builder()
            .id(areaEntrega.getId())
            .lojaId(areaEntrega.getLoja().getId())
            .nome(areaEntrega.getName())
            .tipo(areaEntrega.getType())
            .bairro(areaEntrega.getNeighborhood())
            .cepInicial(areaEntrega.getZipCodeStart())
            .cepFinal(areaEntrega.getZipCodeEnd())
            .raioKm(areaEntrega.getRadiusKm())
            .taxa(areaEntrega.getFee())
            .pedidoMinimo(areaEntrega.getMinimumOrderValue())
            .tempoEstimadoMinutos(areaEntrega.getEstimatedMinutes())
            .ativo(areaEntrega.getActive())
            .build();
    }

    public ListarAreaEntregaResponse toListarAreaEntregaResponse(AreaEntregaLoja areaEntrega) {
        return ListarAreaEntregaResponse.builder()
            .id(areaEntrega.getId())
            .lojaId(areaEntrega.getLoja().getId())
            .nome(areaEntrega.getName())
            .tipo(areaEntrega.getType())
            .taxa(areaEntrega.getFee())
            .pedidoMinimo(areaEntrega.getMinimumOrderValue())
            .tempoEstimadoMinutos(areaEntrega.getEstimatedMinutes())
            .ativo(areaEntrega.getActive())
            .build();
    }

    public DetalharAreaEntregaResponse toDetalharAreaEntregaResponse(AreaEntregaLoja areaEntrega) {
        return DetalharAreaEntregaResponse.builder()
            .id(areaEntrega.getId())
            .lojaId(areaEntrega.getLoja().getId())
            .nome(areaEntrega.getName())
            .tipo(areaEntrega.getType())
            .bairro(areaEntrega.getNeighborhood())
            .cepInicial(areaEntrega.getZipCodeStart())
            .cepFinal(areaEntrega.getZipCodeEnd())
            .raioKm(areaEntrega.getRadiusKm())
            .taxa(areaEntrega.getFee())
            .pedidoMinimo(areaEntrega.getMinimumOrderValue())
            .tempoEstimadoMinutos(areaEntrega.getEstimatedMinutes())
            .ativo(areaEntrega.getActive())
            .build();
    }

    public AtualizarAreaEntregaResponse toAtualizarAreaEntregaResponse(AreaEntregaLoja areaEntrega) {
        return AtualizarAreaEntregaResponse.builder()
            .id(areaEntrega.getId())
            .lojaId(areaEntrega.getLoja().getId())
            .nome(areaEntrega.getName())
            .tipo(areaEntrega.getType())
            .bairro(areaEntrega.getNeighborhood())
            .cepInicial(areaEntrega.getZipCodeStart())
            .cepFinal(areaEntrega.getZipCodeEnd())
            .raioKm(areaEntrega.getRadiusKm())
            .taxa(areaEntrega.getFee())
            .pedidoMinimo(areaEntrega.getMinimumOrderValue())
            .tempoEstimadoMinutos(areaEntrega.getEstimatedMinutes())
            .ativo(areaEntrega.getActive())
            .build();
    }

    public void toEntity(AtualizarAreaEntregaRequest request, AreaEntregaLoja areaEntrega) {
        areaEntrega.setName(request.nome());
        areaEntrega.setType(request.tipo());
        areaEntrega.setNeighborhood(request.bairro());
        areaEntrega.setZipCodeStart(request.cepInicial());
        areaEntrega.setZipCodeEnd(request.cepFinal());
        areaEntrega.setRadiusKm(request.raioKm());
        areaEntrega.setFee(request.taxa());
        areaEntrega.setMinimumOrderValue(request.pedidoMinimo());
        areaEntrega.setEstimatedMinutes(request.tempoEstimadoMinutos());

        if (request.ativo() != null) {
            areaEntrega.setActive(request.ativo());
        }
    }
}
