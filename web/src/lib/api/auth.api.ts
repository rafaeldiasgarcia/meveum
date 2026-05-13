import type { CadastroRequest, LoginRequest, LoginResponse, Usuario } from "@/types";
import {
  armazenarSessao,
  obterToken,
  obterUsuarioSalvo,
  removerSessao,
  request,
  requestAutenticada,
  salvarUsuario,
} from "@/lib/api/client";

export { obterToken, obterUsuarioSalvo };

export type SolicitarRecuperacaoSenhaRequest = { email: string };
export type SolicitarRecuperacaoSenhaResponse = {
  mensagem: string;
  token?: string;
  expiraEm?: string;
};
export type RedefinirSenhaRequest = {
  token: string;
  senha: string;
  confirmarSenha: string;
};
export type ObterUrlOAuthResponse = {
  provedor: "google" | "microsoft" | "apple";
  authorizationUrl: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  armazenarSessao(response);
  return response;
}

export async function cadastrar(data: CadastroRequest): Promise<LoginResponse> {
  const response = await request<LoginResponse>("/auth/registrar", {
    method: "POST",
    body: JSON.stringify(data),
  });
  armazenarSessao(response);
  return response;
}

export async function logout(): Promise<void> {
  removerSessao();
}

export async function obterUsuarioAutenticado(): Promise<Usuario> {
  const usuario = await requestAutenticada<Usuario>("/auth/me", { method: "GET" });

  if (typeof window !== "undefined") {
    salvarUsuario(usuario);
  }

  return usuario;
}

export async function solicitarRecuperacaoSenha(
  data: SolicitarRecuperacaoSenhaRequest
): Promise<SolicitarRecuperacaoSenhaResponse> {
  return request<SolicitarRecuperacaoSenhaResponse>("/auth/esqueci-senha", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function redefinirSenha(data: RedefinirSenhaRequest): Promise<{ mensagem: string }> {
  return request<{ mensagem: string }>("/auth/redefinir-senha", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function obterUrlOAuth(provedor: ObterUrlOAuthResponse["provedor"]): Promise<ObterUrlOAuthResponse> {
  return request<ObterUrlOAuthResponse>(`/auth/oauth/${provedor}`, { method: "GET" });
}
