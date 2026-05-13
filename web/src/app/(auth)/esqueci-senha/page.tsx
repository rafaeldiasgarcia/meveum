"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import { solicitarRecuperacaoSenha } from "@/lib/api/auth.api";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setToken(null);

    try {
      const response = await solicitarRecuperacaoSenha({ email });
      setToken(response.token ?? null);
      toast.success(response.mensagem);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nao foi possivel solicitar a recuperacao.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F4]">
      <header className="flex items-center justify-between px-4 py-5 sm:px-5 lg:px-10">
        <Logo size="md" />
        <Link href="/login" className="flex items-center gap-1.5 text-sm text-[#78716C] transition-colors hover:text-[#1C1917]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para login
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D6] bg-white px-3 py-1.5 shadow-soft">
            <Mail className="h-3 w-3 text-[#EA580C]" />
            <span className="text-xs font-medium text-[#1C1917]">Recuperacao de acesso</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold leading-tight text-[#1C1917]">Redefina sua senha.</h1>
          <p className="mb-8 text-sm text-[#78716C]">
            Informe o e-mail da conta para receber as instrucoes de recuperacao.
          </p>

          <form onSubmit={enviar} data-testid="forgot-password-form" className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1C1917]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@restaurante.com"
                data-testid="forgot-password-email-input"
                className="input-base"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="forgot-password-submit-button"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#EA580C] font-semibold tracking-wide text-white transition-colors hover:bg-[#C2410C] disabled:opacity-60"
            >
              {loading ? "Enviando..." : "ENVIAR INSTRUCOES"}
            </button>
          </form>

          {token && (
            <div className="mt-5 rounded-lg border border-[#E8E0D6] bg-white p-4 text-sm text-[#78716C]" data-testid="forgot-password-dev-token">
              <p className="font-medium text-[#1C1917]">Token de desenvolvimento</p>
              <p className="mt-1 break-all">{token}</p>
              <Link href={`/redefinir-senha?token=${token}`} className="mt-3 inline-block font-semibold text-[#EA580C] hover:underline">
                Redefinir senha agora
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
