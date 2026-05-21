import { describe, expect, it } from "vitest";
import { imagemDoProduto } from "@/features/cardapio-publico/components/CardProduto";
import type { ProdutoPublico } from "@/types/cardapio-publico";

function produto(overrides: Partial<ProdutoPublico> = {}): ProdutoPublico {
  return {
    id: "produto-1",
    nome: "Smash",
    descricao: "Lanche",
    preco: 29.9,
    imagemUrl: null,
    categoriaId: "cat-1",
    ordem: 0,
    ativo: true,
    ...overrides,
  };
}

describe("imagemDoProduto", () => {
  it("aceita imagem externa http controlada pelo next.config", () => {
    expect(imagemDoProduto(produto({ imagemUrl: "https://cdn.exemplo.test/produto.png" })))
      .toBe("https://cdn.exemplo.test/produto.png");
  });

  it("usa fallback local quando a url externa e invalida", () => {
    expect(imagemDoProduto(produto({ imagemUrl: "javascript:alert(1)" }))).toContain("/cardapio-publico/");
  });
});
