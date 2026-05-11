package br.com.meveum.pagamentos.entity;


import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
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
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "store_payment_methods",
    uniqueConstraints = @UniqueConstraint(columnNames = {"store_id", "method"})
)
public class FormaPagamentoLoja {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_id", nullable = false)
    private Loja loja;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 40)
    private FormaPagamento method;

    @Column(nullable = false)
    private Boolean active = true;
}
