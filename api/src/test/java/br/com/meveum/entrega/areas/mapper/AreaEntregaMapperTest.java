package br.com.meveum.entrega.areas.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AreaEntregaMapperTest {

    private final AreaEntregaMapper areaEntregaMapper = new AreaEntregaMapper();

    @Test
    void deveConverterCriarRequestParaEntity() {
        var request = new CriarAreaEntregaRequest(UUID.randomUUID(), "Centro", TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null, BigDecimal.TEN, BigDecimal.ONE, 30);

        var area = areaEntregaMapper.toEntity(request);

        assertThat(area.getLoja()).isNull();
        assertThat(area.getName()).isEqualTo("Centro");
        assertThat(area.getType()).isEqualTo(TipoAreaEntrega.NEIGHBORHOOD);
        assertThat(area.getFee()).isEqualTo(BigDecimal.TEN);
        assertThat(area.getActive()).isTrue();
    }

    @Test
    void deveConverterEntityParaResponses() {
        var area = areaEntrega();

        assertThat(areaEntregaMapper.toCriarAreaEntregaResponse(area).id()).isEqualTo(area.getId());
        assertThat(areaEntregaMapper.toListarAreaEntregaResponse(area).lojaId()).isEqualTo(area.getLoja().getId());
        assertThat(areaEntregaMapper.toDetalharAreaEntregaResponse(area).bairro()).isEqualTo(area.getNeighborhood());
        assertThat(areaEntregaMapper.toAtualizarAreaEntregaResponse(area).taxa()).isEqualTo(area.getFee());
    }

    @Test
    void deveAtualizarEntityComRequest() {
        var area = areaEntrega();
        var request = new AtualizarAreaEntregaRequest("Raio", TipoAreaEntrega.RADIUS, null, null, null, BigDecimal.valueOf(5), BigDecimal.ONE, null, 20, false);

        areaEntregaMapper.toEntity(request, area);

        assertThat(area.getName()).isEqualTo("Raio");
        assertThat(area.getType()).isEqualTo(TipoAreaEntrega.RADIUS);
        assertThat(area.getRadiusKm()).isEqualTo(BigDecimal.valueOf(5));
        assertThat(area.getFee()).isEqualTo(BigDecimal.ONE);
        assertThat(area.getEstimatedMinutes()).isEqualTo(20);
        assertThat(area.getActive()).isFalse();
    }

    private AreaEntregaLoja areaEntrega() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var area = new AreaEntregaLoja();
        area.setId(UUID.randomUUID());
        area.setLoja(loja);
        area.setName("Centro");
        area.setType(TipoAreaEntrega.NEIGHBORHOOD);
        area.setNeighborhood("Centro");
        area.setFee(BigDecimal.TEN);
        area.setMinimumOrderValue(BigDecimal.ONE);
        area.setEstimatedMinutes(30);
        area.setActive(true);
        return area;
    }
}
