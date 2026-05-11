import { describe, it, expect } from "vitest";
import { produtoSchema } from "@/lib/validations/cardapio.schema";

describe("produtoSchema", () => {
  const produtoValido = {
    nome: "Smash Clássico",
    descricao: "Dois smash burgers com cheddar",
    preco: 32.9,
    categoriaId: "cat-1",
    disponivel: true,
    destaque: false,
  };

  it("deve aceitar produto válido", () => {
    const result = produtoSchema.safeParse(produtoValido);
    expect(result.success).toBe(true);
  });

  it("deve aceitar produto sem descrição", () => {
    const { descricao: _, ...semDescricao } = produtoValido;
    const result = produtoSchema.safeParse(semDescricao);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const result = produtoSchema.safeParse({ ...produtoValido, nome: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("nome");
  });

  it("deve rejeitar preço zero", () => {
    const result = produtoSchema.safeParse({ ...produtoValido, preco: 0 });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar preço negativo", () => {
    const result = produtoSchema.safeParse({ ...produtoValido, preco: -5 });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar categoria vazia", () => {
    const result = produtoSchema.safeParse({ ...produtoValido, categoriaId: "" });
    expect(result.success).toBe(false);
  });
});
