import { afterEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:8080";

describe("auth.api", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("deve fazer login no backend e salvar a sessao", async () => {
    const response = {
      token: "token-jwt",
      usuario: {
        id: "user-1",
        lojaId: "loja-1",
        nome: "Admin Meveum",
        email: "admin@meveum.com",
        role: "OWNER",
      },
    };
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { login, obterToken } = await import("@/lib/api/auth.api");
    const resultado = await login({ email: "admin@meveum.com", senha: "meveum123" });

    expect(resultado.token).toBe("token-jwt");
    expect(obterToken()).toBe("token-jwt");
    expect(JSON.parse(window.localStorage.getItem("meveum_usuario") ?? "{}").email).toBe("admin@meveum.com");
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: "admin@meveum.com", senha: "meveum123" }),
      headers: { "Content-Type": "application/json" },
    });
  });

  it("deve propagar mensagem de erro da API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Credenciais invalidas." }),
        })
      )
    );

    const { login } = await import("@/lib/api/auth.api");

    await expect(login({ email: "admin@meveum.com", senha: "errada" })).rejects.toThrow("Credenciais invalidas.");
  });

  it("deve cadastrar no backend e salvar a sessao", async () => {
    const response = {
      token: "token-cadastro",
      usuario: {
        id: "user-2",
        lojaId: "loja-2",
        nome: "Rafael",
        email: "rafael@meveum.com",
        role: "OWNER",
      },
    };
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { cadastrar, obterToken } = await import("@/lib/api/auth.api");
    const request = {
      nome: "Rafael",
      nomeLoja: "Meveum Burgers",
      telefone: "11999999999",
      email: "rafael@meveum.com",
      senha: "meveum123",
      confirmarSenha: "meveum123",
    };
    await cadastrar(request);

    expect(obterToken()).toBe("token-cadastro");
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/auth/registrar`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    });
  });

  it("deve limpar a sessao ao sair", async () => {
    window.localStorage.setItem("meveum_token", "token-jwt");
    window.localStorage.setItem("meveum_usuario", "{}");

    const { logout, obterToken } = await import("@/lib/api/auth.api");
    await logout();

    expect(obterToken()).toBeNull();
    expect(window.localStorage.getItem("meveum_usuario")).toBeNull();
  });

  it("deve recuperar usuario salvo do local storage", async () => {
    window.localStorage.setItem("meveum_usuario", JSON.stringify({
      id: "user-3",
      lojaId: "loja-3",
      nome: "Rafa",
      email: "rafa@meveum.com",
      role: "OWNER",
    }));

    const { obterUsuarioSalvo } = await import("@/lib/api/auth.api");

    expect(obterUsuarioSalvo()?.nome).toBe("Rafa");
  });

  it("deve consultar /auth/me com bearer token e atualizar usuario salvo", async () => {
    window.localStorage.setItem("meveum_token", "token-jwt");
    const usuario = {
      id: "user-4",
      lojaId: "loja-4",
      nome: "Rafael Atualizado",
      email: "rafael@meveum.com",
      role: "OWNER",
    };
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(usuario),
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { obterUsuarioAutenticado, obterUsuarioSalvo } = await import("@/lib/api/auth.api");
    const resposta = await obterUsuarioAutenticado();

    expect(resposta.nome).toBe("Rafael Atualizado");
    expect(obterUsuarioSalvo()?.email).toBe("rafael@meveum.com");
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-jwt",
      },
    });
  });
});
