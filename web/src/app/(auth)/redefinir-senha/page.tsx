"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import { redefinirSenha } from "@/lib/api/auth.api";

export default function RedefinirSenhaPage() {
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await redefinirSenha({ token, senha, confirmarSenha });
      toast.success(response.mensagem);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nao foi possivel redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F4]">
      <header className="flex items-center justify-between px-4 py-5 sm:px-5 lg:px-10">
        <Logo size="md" />
        <Link href="/login" className="text-sm text-[#78716C] transition-colors hover:text-[#1C1917]">
          Voltar para login
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-3xl font-bold leading-tight text-[#1C1917]">Crie uma nova senha.</h1>
          <p className="mb-8 text-sm text-[#78716C]">Use o token recebido para recuperar seu acesso.</p>

          <form onSubmit={enviar} data-testid="reset-password-form" className="space-y-4">
            <div>
              <label htmlFor="token" className="mb-1.5 block text-sm font-medium text-[#1C1917]">Token</label>
              <input id="token" value={token} onChange={(event) => setToken(event.target.value)} className="input-base" data-testid="reset-password-token-input" required />
            </div>
            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-[#1C1917]">Nova senha</label>
              <input id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} className="input-base" data-testid="reset-password-input" required />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="mb-1.5 block text-sm font-medium text-[#1C1917]">Confirmar senha</label>
              <input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)} className="input-base" data-testid="reset-password-confirm-input" required />
            </div>

            <button type="submit" disabled={loading} data-testid="reset-password-submit-button" className="flex h-12 w-full items-center justify-center rounded-lg bg-[#EA580C] font-semibold tracking-wide text-white transition-colors hover:bg-[#C2410C] disabled:opacity-60">
              {loading ? "Salvando..." : "REDEFINIR SENHA"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
