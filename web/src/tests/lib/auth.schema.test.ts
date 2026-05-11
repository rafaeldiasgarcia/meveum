import { describe, it, expect } from "vitest";
import { loginSchema, cadastroSchema } from "@/lib/validations/auth.schema";

describe("loginSchema", () => {
  it("deve aceitar credenciais válidas", () => {
    const result = loginSchema.safeParse({ email: "user@email.com", senha: "senha123" });
    expect(result.success).toBe(true);
  });

  it("deve rejeitar e-mail inválido", () => {
    const result = loginSchema.safeParse({ email: "nao-e-email", senha: "senha123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });

  it("deve rejeitar e-mail vazio", () => {
    const result = loginSchema.safeParse({ email: "", senha: "senha123" });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar senha com menos de 6 caracteres", () => {
    const result = loginSchema.safeParse({ email: "user@email.com", senha: "12345" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("senha");
  });
});

describe("cadastroSchema", () => {
  const dadosValidos = {
    nome: "Carlos Mendes",
    nomeLoja: "Burguer do Carlos",
    telefone: "11987654321",
    email: "carlos@burguer.com",
    senha: "senha123",
    confirmarSenha: "senha123",
  };

  it("deve aceitar dados válidos", () => {
    const result = cadastroSchema.safeParse(dadosValidos);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar quando senhas não conferem", () => {
    const result = cadastroSchema.safeParse({ ...dadosValidos, confirmarSenha: "outraSenha" });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path.includes("confirmarSenha"));
    expect(issue?.message).toBe("As senhas não conferem");
  });

  it("deve rejeitar nome com menos de 2 caracteres", () => {
    const result = cadastroSchema.safeParse({ ...dadosValidos, nome: "A" });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar telefone muito curto", () => {
    const result = cadastroSchema.safeParse({ ...dadosValidos, telefone: "1199" });
    expect(result.success).toBe(false);
  });
});
