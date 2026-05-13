"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Utensils } from "lucide-react";
import { toast } from "sonner";
import { AuthCarousel } from "@/features/auth/components/AuthCarousel";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { login } from "@/lib/api/auth.api";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.65 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1S8.7 6 12 6c1.88 0 3.14.8 3.86 1.5l2.63-2.54C16.86 3.4 14.65 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12S6.76 21.5 12 21.5c6.92 0 9.5-4.86 9.5-7.4 0-.5-.05-.88-.13-1.27H12z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.37 12.62c-.02-2.4 1.96-3.55 2.05-3.61-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.89.87-3.64.87-.76 0-1.92-.85-3.16-.83-1.62.02-3.12.94-3.95 2.4-1.69 2.92-.43 7.24 1.21 9.61.81 1.16 1.77 2.46 3.03 2.41 1.22-.05 1.68-.79 3.16-.79 1.47 0 1.89.79 3.18.76 1.31-.02 2.14-1.18 2.94-2.34.93-1.34 1.31-2.65 1.33-2.72-.03-.01-2.55-.98-2.57-3.87zM13.96 5.4c.67-.81 1.12-1.93.99-3.05-.96.04-2.12.64-2.81 1.45-.62.71-1.16 1.85-1.02 2.94 1.07.08 2.17-.54 2.84-1.34z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data);
      toast.success("Bem-vindo de volta!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao entrar");
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 lg:grid-cols-2">

        {/* ── Left panel — form ──────────────────────────────────────────── */}
        <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">

          {/* Header */}
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember text-white shadow-ember">
                <Utensils className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-[#1C1917]">MeVêUm</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-[#1C1917]/60 transition hover:text-[#1C1917]"
            >
              ← Voltar ao site
            </Link>
          </header>

          {/* Content */}
          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-md py-10">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E0D6] bg-white px-3 py-1 text-xs font-medium text-[#1C1917]/70">
                <Sparkles className="h-3 w-3 text-ember" aria-hidden />
                Bem-vindo de volta
              </div>

              {/* Title */}
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-[#1C1917] md:text-4xl">
                Entre na sua<span className="text-ember"> central de pedidos.</span>
              </h1>
              <p className="mt-3 text-sm text-[#1C1917]/65">
                Acesse seu cardápio, dashboard e pedidos em um só lugar.
              </p>

              {/* Social buttons */}
              <div className="mt-7 grid grid-cols-3 gap-2">
                {[
                  { label: "Google", icon: <GoogleIcon /> },
                  { label: "Microsoft", icon: <MicrosoftIcon /> },
                  { label: "Apple", icon: <AppleIcon /> },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toast.info(`Login com ${label} em breve`)}
                    className="flex items-center justify-center gap-2 rounded-md border border-[#E8E0D6] bg-white py-2.5 text-sm font-medium text-[#1C1917]/80 shadow-soft transition hover:border-[#1C1917]/20 hover:text-[#1C1917]"
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E8E0D6]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C1917]/45">
                  ou com e-mail
                </span>
                <div className="h-px flex-1 bg-[#E8E0D6]" />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                data-testid="login-form"
                className="space-y-3.5"
              >
                <label className="block">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917]/80">E-mail</span>
                  </span>
                  <input
                    type="email"
                    maxLength={160}
                    placeholder="voce@restaurante.com"
                    autoComplete="email"
                    data-testid="email-input"
                    className={`input-base${errors.email ? " border-red-400 focus:border-red-400" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500" data-testid="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917]/80">Senha</span>
                    <a href="#" className="text-xs font-medium text-ember hover:underline">
                      Esqueci a senha
                    </a>
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      maxLength={72}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      data-testid="password-input"
                      className={`input-base pr-10${errors.senha ? " border-red-400 focus:border-red-400" : ""}`}
                      {...register("senha")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Mostrar senha"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#1C1917]/50 transition hover:text-[#1C1917]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="mt-1 text-xs text-red-500" data-testid="password-error">
                      {errors.senha.message}
                    </p>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="submit-login-button"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember py-3 text-sm font-bold uppercase tracking-wider text-white shadow-ember transition hover:bg-ember-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                  {!isSubmitting && (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#1C1917]/65">
                Ainda não tem conta?{" "}
                <Link href="/register" className="font-semibold text-ember hover:underline">
                  Criar conta grátis
                </Link>
              </p>

              {/* Security note */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#1C1917]/50">
                <ShieldCheck className="h-3.5 w-3.5 text-ember" aria-hidden />
                Conexão segura · seus dados são criptografados
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 text-xs text-[#1C1917]/45">
            © 2026 MeVêUm · Sistema para restaurantes brasileiros
          </footer>
        </div>

        {/* ── Right panel — carousel ──────────────────────────────────────── */}
        <AuthCarousel />
      </div>
    </div>
  );
}
