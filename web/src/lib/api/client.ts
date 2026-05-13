import type { LoginResponse, Usuario } from "@/types";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
export const TOKEN_KEY = "meveum_token";
export const USUARIO_KEY = "meveum_usuario";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const mensagem = await extrairMensagemErro(response);
    throw new Error(mensagem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function requestAutenticada<T>(path: string, init?: RequestInit): Promise<T> {
  const token = obterToken();
  if (!token) {
    throw new Error("Sessao expirada.");
  }

  return request<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export function armazenarSessao(response: LoginResponse) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, response.token);
  window.localStorage.setItem(USUARIO_KEY, JSON.stringify(response.usuario));
}

export function removerSessao() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USUARIO_KEY);
}

export function obterToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function obterUsuarioSalvo(): Usuario | null {
  if (typeof window === "undefined") {
    return null;
  }

  const usuario = window.localStorage.getItem(USUARIO_KEY);
  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario) as Usuario;
  } catch {
    window.localStorage.removeItem(USUARIO_KEY);
    return null;
  }
}

export function obterLojaId(): string {
  const lojaId = obterUsuarioSalvo()?.lojaId;
  if (!lojaId) {
    throw new Error("Loja da sessao nao encontrada.");
  }

  return lojaId;
}

export function salvarUsuario(usuario: Usuario) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }
}

async function extrairMensagemErro(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.mensagem
      ?? body.message
      ?? body.erro
      ?? "Nao foi possivel concluir a operacao.";
  } catch {
    return "Nao foi possivel concluir a operacao.";
  }
}
