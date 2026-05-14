package br.com.meveum.lojas.dto;

import br.com.meveum.lojas.entity.enums.LojaStatus;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;

@Builder
public record DetalharLojaResponse(
    UUID id,
    String nome,
    String slug,
    String logoUrl,
    String whatsappNumber,
    String telefone,
    String endereco,
    String descricao,
    String pixKey,
    LojaStatus status,
    Boolean pausadaManualmente,
    Boolean operacional,
    List<HorarioFuncionamentoResponse> horarios,
    List<TaxaEntregaLojaResponse> taxasEntrega,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
