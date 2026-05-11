package br.com.meveum.lojas.mapper;

import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarLojaResponse;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaResponse;
import br.com.meveum.lojas.dto.AtualizarStatusLojaResponse;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import org.springframework.stereotype.Component;

@Component
public class LojaMapper {

    public DetalharLojaResponse toDetalharLojaResponse(Loja loja) {
        return DetalharLojaResponse.builder()
            .id(loja.getId())
            .nome(loja.getName())
            .slug(loja.getSlug())
            .logoUrl(loja.getLogoUrl())
            .whatsappNumber(loja.getWhatsappNumber())
            .status(loja.getStatus())
            .pausadaManualmente(loja.getManuallyPaused())
            .operacional(toOperacional(loja))
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

        if (request.logoUrl() != null) {
            loja.setLogoUrl(request.logoUrl());
        }
    }

    private Boolean toOperacional(Loja loja) {
        return loja.getStatus() == LojaStatus.ACTIVE && !loja.getManuallyPaused();
    }
}
