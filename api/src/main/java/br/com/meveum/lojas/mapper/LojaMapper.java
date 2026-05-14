package br.com.meveum.lojas.mapper;

import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarLojaResponse;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaResponse;
import br.com.meveum.lojas.dto.AtualizarStatusLojaResponse;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.dto.TaxaEntregaLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.PeriodoFuncionamentoLoja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class LojaMapper {

    public DetalharLojaResponse toDetalharLojaResponse(Loja loja) {
        return toDetalharLojaResponse(loja, List.of(), List.of());
    }

    public DetalharLojaResponse toDetalharLojaResponse(
        Loja loja,
        List<PeriodoFuncionamentoLoja> horarios,
        List<AreaEntregaLoja> taxasEntrega
    ) {
        return DetalharLojaResponse.builder()
            .id(loja.getId())
            .nome(loja.getName())
            .slug(loja.getSlug())
            .logoUrl(loja.getLogoUrl())
            .whatsappNumber(loja.getWhatsappNumber())
            .telefone(loja.getPhone())
            .endereco(loja.getAddress())
            .descricao(loja.getDescription())
            .pixKey(loja.getPixKey())
            .status(loja.getStatus())
            .pausadaManualmente(loja.getManuallyPaused())
            .operacional(toOperacional(loja))
            .horarios(toHorarioFuncionamentoResponseList(horarios))
            .taxasEntrega(toTaxaEntregaLojaResponseList(taxasEntrega))
            .criadoEm(loja.getCreatedAt())
            .atualizadoEm(loja.getUpdatedAt())
            .build();
    }

    public AtualizarLojaResponse toAtualizarLojaResponse(Loja loja) {
        return AtualizarLojaResponse.builder()
            .id(loja.getId())
            .nome(loja.getName())
            .slug(loja.getSlug())
            .logoUrl(loja.getLogoUrl())
            .whatsappNumber(loja.getWhatsappNumber())
            .telefone(loja.getPhone())
            .endereco(loja.getAddress())
            .descricao(loja.getDescription())
            .pixKey(loja.getPixKey())
            .status(loja.getStatus())
            .pausadaManualmente(loja.getManuallyPaused())
            .operacional(toOperacional(loja))
            .criadoEm(loja.getCreatedAt())
            .atualizadoEm(loja.getUpdatedAt())
            .build();
    }

    public AtualizarPausaManualLojaResponse toAtualizarPausaManualLojaResponse(Loja loja) {
        return AtualizarPausaManualLojaResponse.builder()
            .id(loja.getId())
            .status(loja.getStatus())
            .pausadaManualmente(loja.getManuallyPaused())
            .operacional(toOperacional(loja))
            .atualizadoEm(loja.getUpdatedAt())
            .build();
    }

    public AtualizarStatusLojaResponse toAtualizarStatusLojaResponse(Loja loja) {
        return AtualizarStatusLojaResponse.builder()
            .id(loja.getId())
            .status(loja.getStatus())
            .pausadaManualmente(loja.getManuallyPaused())
            .operacional(toOperacional(loja))
            .atualizadoEm(loja.getUpdatedAt())
            .build();
    }

    public void toEntity(AtualizarLojaRequest request, Loja loja) {
        loja.setName(request.nome());
        loja.setSlug(request.slug());
        loja.setWhatsappNumber(request.whatsappNumber());
        loja.setPhone(request.telefone());
        loja.setAddress(request.endereco());
        loja.setDescription(request.descricao());
        loja.setPixKey(request.pixKey());

        if (request.logoUrl() != null) {
            loja.setLogoUrl(request.logoUrl());
        }
    }

    private List<HorarioFuncionamentoResponse> toHorarioFuncionamentoResponseList(
        List<PeriodoFuncionamentoLoja> horarios
    ) {
        return horarios.stream()
            .map(this::toHorarioFuncionamentoResponse)
            .toList();
    }

    private HorarioFuncionamentoResponse toHorarioFuncionamentoResponse(PeriodoFuncionamentoLoja horario) {
        return HorarioFuncionamentoResponse.builder()
            .id(horario.getId())
            .diaSemana(horario.getDayOfWeek())
            .abertura(horario.getOpensAt())
            .fechamento(horario.getClosesAt())
            .ativo(horario.getActive())
            .build();
    }

    private List<TaxaEntregaLojaResponse> toTaxaEntregaLojaResponseList(List<AreaEntregaLoja> taxasEntrega) {
        return taxasEntrega.stream()
            .map(this::toTaxaEntregaLojaResponse)
            .toList();
    }

    private TaxaEntregaLojaResponse toTaxaEntregaLojaResponse(AreaEntregaLoja areaEntrega) {
        return TaxaEntregaLojaResponse.builder()
            .id(areaEntrega.getId())
            .nome(areaEntrega.getName())
            .tipo(areaEntrega.getType())
            .bairro(areaEntrega.getNeighborhood())
            .cepInicial(areaEntrega.getZipCodeStart())
            .cepFinal(areaEntrega.getZipCodeEnd())
            .raioKm(areaEntrega.getRadiusKm())
            .taxa(areaEntrega.getFee())
            .pedidoMinimo(areaEntrega.getMinimumOrderValue())
            .tempoEstimadoMinutos(areaEntrega.getEstimatedMinutes())
            .tempoMin(areaEntrega.getEstimatedMinutes())
            .ativo(areaEntrega.getActive())
            .build();
    }

    private Boolean toOperacional(Loja loja) {
        return loja.getStatus() == LojaStatus.ACTIVE && !loja.getManuallyPaused();
    }
}
