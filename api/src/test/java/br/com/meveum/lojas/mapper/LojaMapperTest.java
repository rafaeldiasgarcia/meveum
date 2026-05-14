package br.com.meveum.lojas.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class LojaMapperTest {

    private final LojaMapper lojaMapper = new LojaMapper();

    @Test
    void deveConverterLojaParaDetalharLojaResponse() {
        var loja = loja();

        var response = lojaMapper.toDetalharLojaResponse(loja);

        assertThat(response.id()).isEqualTo(loja.getId());
        assertThat(response.nome()).isEqualTo(loja.getName());
        assertThat(response.slug()).isEqualTo(loja.getSlug());
        assertThat(response.operacional()).isTrue();
        assertThat(response.criadoEm()).isEqualTo(loja.getCreatedAt());
    }

    @Test
    void deveConverterLojaParaAtualizarLojaResponse() {
        var loja = loja();

        var response = lojaMapper.toAtualizarLojaResponse(loja);

        assertThat(response.id()).isEqualTo(loja.getId());
        assertThat(response.whatsappNumber()).isEqualTo(loja.getWhatsappNumber());
        assertThat(response.operacional()).isTrue();
    }

    @Test
    void deveConverterLojaParaAtualizarPausaManualResponse() {
        var loja = loja();
        loja.setManuallyPaused(true);

        var response = lojaMapper.toAtualizarPausaManualLojaResponse(loja);

        assertThat(response.id()).isEqualTo(loja.getId());
        assertThat(response.pausadaManualmente()).isTrue();
        assertThat(response.operacional()).isFalse();
    }

    @Test
    void deveConverterLojaParaAtualizarStatusResponse() {
        var loja = loja();
        loja.setStatus(LojaStatus.INACTIVE);

        var response = lojaMapper.toAtualizarStatusLojaResponse(loja);

        assertThat(response.status()).isEqualTo(LojaStatus.INACTIVE);
        assertThat(response.operacional()).isFalse();
    }

    @Test
    void deveAtualizarEntityComAtualizarLojaRequest() {
        var loja = loja();
        var request = new AtualizarLojaRequest(
            "Nova Loja",
            "nova-loja",
            "logo",
            "5511888888888",
            "5511777777777",
            "Rua Teste, 123",
            "Descricao da loja",
            "pix@teste.com"
        );

        lojaMapper.toEntity(request, loja);

        assertThat(loja.getName()).isEqualTo("Nova Loja");
        assertThat(loja.getSlug()).isEqualTo("nova-loja");
        assertThat(loja.getLogoUrl()).isEqualTo("logo");
        assertThat(loja.getWhatsappNumber()).isEqualTo("5511888888888");
        assertThat(loja.getPhone()).isEqualTo("5511777777777");
        assertThat(loja.getAddress()).isEqualTo("Rua Teste, 123");
        assertThat(loja.getDescription()).isEqualTo("Descricao da loja");
        assertThat(loja.getPixKey()).isEqualTo("pix@teste.com");
    }

    private Loja loja() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        loja.setName("Loja");
        loja.setSlug("loja");
        loja.setLogoUrl("logo");
        loja.setWhatsappNumber("5511999999999");
        loja.setPhone("5511888888888");
        loja.setAddress("Rua A");
        loja.setDescription("Loja teste");
        loja.setPixKey("pix@loja.com");
        loja.setStatus(LojaStatus.ACTIVE);
        loja.setManuallyPaused(false);
        loja.setCreatedAt(OffsetDateTime.now().minusDays(1));
        loja.setUpdatedAt(OffsetDateTime.now());
        return loja;
    }
}
