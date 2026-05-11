package br.com.meveum.entrega.entity;


import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "store_delivery_zones")
public class AreaEntregaLoja {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_id", nullable = false)
    private Loja loja;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoAreaEntrega type;

    @Column(length = 120)
    private String neighborhood;

    @Column(name = "zip_code_start", length = 12)
    private String zipCodeStart;

    @Column(name = "zip_code_end", length = 12)
    private String zipCodeEnd;

    @Column(name = "radius_km", precision = 8, scale = 2)
    private BigDecimal radiusKm;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(name = "minimum_order_value", precision = 12, scale = 2)
    private BigDecimal minimumOrderValue;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Column(nullable = false)
    private Boolean active = true;
}
