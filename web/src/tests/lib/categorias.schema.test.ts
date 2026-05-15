import { describe, it, expect } from "vitest";
import { categoriaSchema } from "@/lib/validations/cardapio.schema";

describe("categoriaSchema", () => {
  const categoriaValida = { nome: "Hambúrgueres", descricao: "Nossos burgers", ordem: 1 };

  it("deve aceitar categoria válida", () => {
    expect(categoriaSchema.safeParse(categoriaValida).success).toBe(true);
  });

  it("deve aceitar categoria sem descrição e sem ordem", () => {
    expect(categoriaSchema.safeParse({ nome: "Bebidas" }).success).toBe(true);
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const result = categoriaSchema.safeParse({ ...categoriaValida, nome: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("nome");
  });

  it("deve rejeitar nome vazio", () => {
    const result = categoriaSchema.safeParse({ ...categoriaValida, nome: "" });
    expect(result.success).toBe(false);
  });

  it("deve aceitar ordem zero", () => {
    expect(categoriaSchema.safeParse({ ...categoriaValida, ordem: 0 }).success).toBe(true);
  });
});
