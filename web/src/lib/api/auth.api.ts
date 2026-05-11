import type { LoginRequest, LoginResponse, CadastroRequest, Usuario } from "@/types";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

const mockUsuario: Usuario = {
  id: "usr-1",
  nome: "Bryan Calvarenga",
  email: "bryan@smashburguer.com",
  avatar: undefined,
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  await delay();
  if (data.email === "demo@meveum.com.br" && data.senha === "demo1234") {
    return { token: "mock-jwt-token-xyz", usuario: mockUsuario };
  }
  // Aceita qualquer combinação válida para demo
  if (data.email && data.senha.length >= 6) {
    return { token: "mock-jwt-token-xyz", usuario: { ...mockUsuario, email: data.email } };
  }
  throw new Error("Email ou senha incorretos.");
}

export async function cadastrar(data: CadastroRequest): Promise<LoginResponse> {
  await delay(800);
  return {
    token: "mock-jwt-token-xyz",
    usuario: { id: `usr-${Date.now()}`, nome: data.nome, email: data.email },
  };
}

export async function logout(): Promise<void> {
  await delay(200);
}
