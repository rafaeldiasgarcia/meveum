package br.com.meveum.pedidos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarComplementoPedidoServiceTest {

    @Mock
    private OpcaoComplementoRepository opcaoComplementoRepository;
    @Mock
    private ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    @InjectMocks
    private ValidarComplementoPedidoService service;

    @Test
    void deveRetornarComplementoAtivoVinculadoAoProduto() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        var opcao = opcao(true, true);
        when(opcaoComplementoRepository.findByIdAndLojaId(opcaoId, lojaId)).thenReturn(Optional.of(opcao));
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, opcao.getGrupoComplemento().getId()))
            .thenReturn(Optional.of(new ProdutoGrupoComplemento()));

        assertThat(service.validar(lojaId, produtoId, opcaoId)).isEqualTo(opcao);
    }

    @Test
    void deveLancarErroQuandoOpcaoNaoExistir() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        when(opcaoComplementoRepository.findByIdAndLojaId(opcaoId, lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(lojaId, produtoId, opcaoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Opcao de complemento do pedido nao encontrada.");
    }

    @Test
    void deveLancarErroQuandoComplementoInativo() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        when(opcaoComplementoRepository.findByIdAndLojaId(opcaoId, lojaId)).thenReturn(Optional.of(opcao(false, true)));

        assertThatThrownBy(() -> service.validar(lojaId, produtoId, opcaoId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Complemento do pedido nao esta ativo.");
    }

    @Test
    void deveLancarErroQuandoComplementoNaoPertenceAoProduto() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var opcaoId = UUID.randomUUID();
        var opcao = opcao(true, true);
        when(opcaoComplementoRepository.findByIdAndLojaId(opcaoId, lojaId)).thenReturn(Optional.of(opcao));
        when(produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, opcao.getGrupoComplemento().getId()))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(lojaId, produtoId, opcaoId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Complemento nao pertence ao produto informado.");
    }

    @Test
    void deveValidarQuantidadesObrigatorias() {
        var produtoId = UUID.randomUUID();
        var grupo = grupo(1, 2, true);
        when(produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId))
            .thenReturn(List.of(vinculo(grupo, true)));

        service.validarQuantidadesObrigatorias(produtoId, Map.of(grupo.getId(), 1));
    }

    @Test
    void deveLancarErroQuandoComplementoObrigatorioNaoInformado() {
        var produtoId = UUID.randomUUID();
        var grupo = grupo(1, 2, true);
        when(produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId))
            .thenReturn(List.of(vinculo(grupo, true)));

        assertThatThrownBy(() -> service.validarQuantidadesObrigatorias(produtoId, Map.of()))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Quantidade minima de complementos nao atingida.");
    }

    @Test
    void deveLancarErroQuandoMaximoComplementoForExcedido() {
        var produtoId = UUID.randomUUID();
        var grupo = grupo(0, 1, true);
        when(produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId))
            .thenReturn(List.of(vinculo(grupo, true)));

        assertThatThrownBy(() -> service.validarQuantidadesObrigatorias(produtoId, Map.of(grupo.getId(), 2)))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Quantidade maxima de complementos excedida.");
    }

    private OpcaoComplemento opcao(boolean opcaoAtiva, boolean grupoAtivo) {
        var grupo = grupo(0, 1, grupoAtivo);
        return OpcaoComplemento.builder()
            .id(UUID.randomUUID())
            .grupoComplemento(grupo)
            .name("Maionese")
            .additionalPrice(BigDecimal.ONE)
            .active(opcaoAtiva)
            .build();
    }

    private GrupoComplemento grupo(Integer minimo, Integer maximo, boolean ativo) {
        return GrupoComplemento.builder()
            .id(UUID.randomUUID())
            .name("Molhos")
            .minQuantity(minimo)
            .maxQuantity(maximo)
            .active(ativo)
            .build();
    }

    private ProdutoGrupoComplemento vinculo(GrupoComplemento grupo, boolean ativo) {
        return ProdutoGrupoComplemento.builder()
            .grupoComplemento(grupo)
            .active(ativo)
            .build();
    }
}
