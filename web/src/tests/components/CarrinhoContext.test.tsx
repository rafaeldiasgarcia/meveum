import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarrinhoProvider, useCarrinho } from "@/features/cardapio-publico/context/CarrinhoContext";
import type { ItemCarrinho } from "@/types/cardapio-publico";

const itemBase: Omit<ItemCarrinho, "uid"> = {
  produtoId: "prod-1",
  nomeProduto: "Smash Clássico",
  precoBase: 32.9,
  quantidade: 1,
  complementosSelecionados: [],
  subtotal: 32.9,
};

const itemComComplemento: Omit<ItemCarrinho, "uid"> = {
  produtoId: "prod-2",
  nomeProduto: "Smash Bacon",
  precoBase: 38.9,
  quantidade: 1,
  complementosSelecionados: [
    {
      opcaoComplementoId: "opc-1",
      nomeGrupo: "Ponto da carne",
      nomeOpcao: "Ao ponto",
      precoAdicional: 0,
      quantidade: 1,
    },
    {
      opcaoComplementoId: "opc-2",
      nomeGrupo: "Adicionais",
      nomeOpcao: "Bacon extra",
      precoAdicional: 5,
      quantidade: 1,
    },
  ],
  subtotal: 43.9,
};

function TesteCarrinho({ acao }: { acao: (ctx: ReturnType<typeof useCarrinho>) => void }) {
  const ctx = useCarrinho();
  return (
    <div>
      <span data-testid="total">{ctx.total.toFixed(2)}</span>
      <span data-testid="quantidade">{ctx.quantidadeTotal}</span>
      <span data-testid="itens">{ctx.itens.length}</span>
      <button data-testid="acao" onClick={() => acao(ctx)}>
        executar
      </button>
    </div>
  );
}

function renderComContexto(acao: (ctx: ReturnType<typeof useCarrinho>) => void) {
  return render(
    <CarrinhoProvider>
      <TesteCarrinho acao={acao} />
    </CarrinhoProvider>
  );
}

describe("CarrinhoContext", () => {
  it("deve iniciar vazio", () => {
    renderComContexto(() => {});
    expect(screen.getByTestId("total").textContent).toBe("0.00");
    expect(screen.getByTestId("quantidade").textContent).toBe("0");
    expect(screen.getByTestId("itens").textContent).toBe("0");
  });

  it("deve adicionar item e calcular total", async () => {
    const user = userEvent.setup();
    renderComContexto((ctx) => ctx.adicionarItem(itemBase));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("32.90");
    expect(screen.getByTestId("quantidade").textContent).toBe("1");
    expect(screen.getByTestId("itens").textContent).toBe("1");
  });

  it("deve acumular total ao adicionar dois itens", async () => {
    const user = userEvent.setup();
    let chamadas = 0;
    renderComContexto((ctx) => {
      chamadas++;
      if (chamadas === 1) ctx.adicionarItem(itemBase);
      else ctx.adicionarItem(itemComComplemento);
    });
    await user.click(screen.getByTestId("acao"));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("76.80");
    expect(screen.getByTestId("quantidade").textContent).toBe("2");
  });

  it("deve remover item e atualizar total", async () => {
    const user = userEvent.setup();
    let uid = "";
    let passo = 0;
    renderComContexto((ctx) => {
      passo++;
      if (passo === 1) {
        ctx.adicionarItem(itemBase);
      } else if (passo === 2) {
        uid = ctx.itens[0]?.uid ?? "";
        ctx.removerItem(uid);
      }
    });
    await user.click(screen.getByTestId("acao"));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("0.00");
    expect(screen.getByTestId("itens").textContent).toBe("0");
  });

  it("deve alterar quantidade e recalcular subtotal", async () => {
    const user = userEvent.setup();
    let passo = 0;
    renderComContexto((ctx) => {
      passo++;
      if (passo === 1) ctx.adicionarItem(itemBase);
      else if (passo === 2) ctx.alterarQuantidade(ctx.itens[0].uid, 3);
    });
    await user.click(screen.getByTestId("acao"));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("98.70");
    expect(screen.getByTestId("quantidade").textContent).toBe("3");
  });

  it("deve limpar o carrinho", async () => {
    const user = userEvent.setup();
    let passo = 0;
    renderComContexto((ctx) => {
      passo++;
      if (passo === 1) {
        ctx.adicionarItem(itemBase);
        ctx.adicionarItem(itemComComplemento);
      } else {
        ctx.limpar();
      }
    });
    await user.click(screen.getByTestId("acao"));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("0.00");
    expect(screen.getByTestId("itens").textContent).toBe("0");
  });

  it("deve calcular subtotal com complementos corretamente", async () => {
    const user = userEvent.setup();
    renderComContexto((ctx) => ctx.adicionarItem(itemComComplemento));
    await user.click(screen.getByTestId("acao"));
    expect(screen.getByTestId("total").textContent).toBe("43.90");
  });

  it("deve calcular subtotal ao alterar quantidade com complementos", async () => {
    const user = userEvent.setup();
    let passo = 0;
    renderComContexto((ctx) => {
      passo++;
      if (passo === 1) ctx.adicionarItem(itemComComplemento);
      else ctx.alterarQuantidade(ctx.itens[0].uid, 2);
    });
    await user.click(screen.getByTestId("acao"));
    await user.click(screen.getByTestId("acao"));
    // (38.9 + 5) * 2 = 87.8
    expect(screen.getByTestId("total").textContent).toBe("87.80");
  });
});
