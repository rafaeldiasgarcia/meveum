import type { CadastroRequest, LoginRequest, LoginResponse, Usuario } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "meveum_token";
const USUARIO_KEY = "meveum_usuario";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

  return response.json();
}

async function requestAutenticada<T>(path: string, init?: RequestInit): Promise<T> {
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

async function extrairMensagemErro(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.message ?? body.erro ?? "Nao foi possivel concluir a operacao.";
  } catch {
    return "Nao foi possivel concluir a operacao.";
  }
}

function armazenarSessao(response: LoginResponse) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, response.token);
  window.localStorage.setItem(USUARIO_KEY, JSON.stringify(response.usuario));
}

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

export async function obterUsuarioAutenticado(): Promise<Usuario> {
  const usuario = await requestAutenticada<Usuario>("/auth/me", { method: "GET" });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  return usuario;
}
