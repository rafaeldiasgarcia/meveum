import { describe, it, expect } from "vitest";
import { grupoComplementoSchema, opcaoComplementoSchema } from "@/lib/validations/complementos.schema";

describe("grupoComplementoSchema", () => {
  const grupoValido = { nome: "Molhos", quantidadeMinima: 0, quantidadeMaxima: 2 };

  it("deve aceitar grupo válido", () => {
    expect(grupoComplementoSchema.safeParse(grupoValido).success).toBe(true);
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const result = grupoComplementoSchema.safeParse({ ...grupoValido, nome: "M" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("nome");
  });

  it("deve rejeitar quantidade mínima negativa", () => {
    const result = grupoComplementoSchema.safeParse({ ...grupoValido, quantidadeMinima: -1 });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quantidade máxima zero", () => {
    const result = grupoComplementoSchema.safeParse({ ...grupoValido, quantidadeMaxima: 0 });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quando máximo é menor que mínimo", () => {
    const result = grupoComplementoSchema.safeParse({ ...grupoValido, quantidadeMinima: 3, quantidadeMaxima: 2 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("quantidadeMaxima");
  });

  it("deve aceitar obrigatório (mínimo > 0)", () => {
    expect(grupoComplementoSchema.safeParse({ ...grupoValido, quantidadeMinima: 1 }).success).toBe(true);
  });
});

describe("opcaoComplementoSchema", () => {
  const opcaoValida = { nome: "Bacon", descricao: "Bacon crocante", precoAdicional: 3.5 };

  it("deve aceitar opção válida", () => {
    expect(opcaoComplementoSchema.safeParse(opcaoValida).success).toBe(true);
  });

  it("deve aceitar opção sem descrição", () => {
    const { descricao: _, ...semDescricao } = opcaoValida;
    expect(opcaoComplementoSchema.safeParse(semDescricao).success).toBe(true);
  });

  it("deve aceitar preço adicional zero (grátis)", () => {
    expect(opcaoComplementoSchema.safeParse({ ...opcaoValida, precoAdicional: 0 }).success).toBe(true);
  });

  it("deve rejeitar preço adicional negativo", () => {
    const result = opcaoComplementoSchema.safeParse({ ...opcaoValida, precoAdicional: -1 });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const result = opcaoComplementoSchema.safeParse({ ...opcaoValida, nome: "B" });
    expect(result.success).toBe(false);
  });
});
