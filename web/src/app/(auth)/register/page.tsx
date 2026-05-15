"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthCarousel } from "@/features/auth/components/AuthCarousel";
import { cadastrar, obterUrlOAuth, type ObterUrlOAuthResponse } from "@/lib/api/auth.api";
import { cadastroSchema, type CadastroFormData } from "@/lib/validations/auth.schema";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="20" viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-162-39.3c-73.4 0-99.9 40.8-163.4 40.8s-105.4-57.2-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.5 135.4-317.5 269-317.5 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.3-49.1 189.2-49.1 30.8 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

function AuthBrand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="MeVêUm">
      <span className="grid h-[46px] w-[46px] place-items-center rounded-[18px] bg-[#FF5C0A] text-white shadow-[0_22px_55px_rgba(234,88,12,0.28)]">
        <Utensils className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-2xl font-bold tracking-normal text-black">MeVêUm</span>
    </Link>
  );
}

const inputClass =
  "input-base h-[54px] rounded-lg border-[#E8E0D6] bg-[#FBF7F4] px-4 text-base text-[#1C1917] placeholder:text-[#8D8780] focus:border-[#FF5C0A] focus:ring-2 focus:ring-[#FF5C0A]/15";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ resolver: zodResolver(cadastroSchema) });

  async function onSubmit(data: CadastroFormData) {
    if (!termsAccepted) {
      toast.error("Aceite os Termos de Uso para continuar.");
      return;
    }

    try {
      await cadastrar(data);
      toast.success("Conta criada! Bem-vindo ao MeVêUm.");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  }

  async function iniciarOAuth(provedor: ObterUrlOAuthResponse["provedor"]) {
    try {
      const response = await obterUrlOAuth(provedor);
      window.location.assign(response.authorizationUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível iniciar o cadastro social.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FBF7F4]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
          <header className="flex items-center justify-between gap-4">
            <AuthBrand />
            <Link href="/" className="text-lg font-medium text-[#6F6861] transition-colors hover:text-[#1C1917]">
              ← Voltar ao site
            </Link>
          </header>

          <div className="flex flex-1 items-center py-10">
            <div className="mx-auto w-full max-w-[560px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8E0D6] bg-[#FBF7F4] px-4 py-1.5 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
                <Sparkles className="h-4 w-4 text-[#FF5C0A]" aria-hidden />
                <span className="text-base font-medium text-[#3B342E]">Criar conta grátis</span>
              </div>

              <h1 className="max-w-[540px] text-[40px] font-bold leading-[1.12] tracking-normal text-black sm:text-[44px]">
                Comece a vender mais <span className="text-[#FF5C0A]">hoje mesmo.</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#625A53]">
                Crie sua conta MeVêUm em menos de 1 minuto. Sem cartão de crédito.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Google", provedor: "google" as const, icon: <GoogleIcon /> },
                  { label: "Microsoft", provedor: "microsoft" as const, icon: <MicrosoftIcon /> },
                  { label: "Apple", provedor: "apple" as const, icon: <AppleIcon /> },
                ].map(({ label, provedor, icon }) => (
                  <button
                    key={provedor}
                    type="button"
                    onClick={() => iniciarOAuth(provedor)}
                    data-testid={`social-register-${provedor}`}
                    className="flex h-[54px] items-center justify-center gap-3 rounded-lg border border-[#E8E0D6] bg-[#FBF7F4] text-lg font-medium text-[#2C2722] shadow-[0_2px_8px_rgba(28,25,23,0.08)] transition hover:bg-white"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2D9CF]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#FBF7F4] px-4 text-sm font-bold tracking-[0.32em] text-[#AAA29A]">
                    OU COM E-MAIL
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="register-form" className="space-y-4">
                <div>
                  <label htmlFor="nomeLoja" className="mb-2 block text-sm font-bold text-[#1C1917]">
                    Nome do restaurante
                  </label>
                  <input
                    id="nomeLoja"
                    placeholder="Burger do Zé"
                    data-testid="nome-loja-input"
                    className={`${inputClass}${errors.nomeLoja ? " border-red-400 focus:border-red-400" : ""}`}
                    {...register("nomeLoja")}
                  />
                  {errors.nomeLoja && (
                    <p className="mt-1.5 text-sm text-red-500" data-testid="nome-loja-error">
                      {errors.nomeLoja.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="mb-2 block text-sm font-bold text-[#1C1917]">
                      Seu nome
                    </label>
                    <input
                      id="nome"
                      placeholder="Carlos Mendes"
                      data-testid="nome-input"
                      className={`${inputClass}${errors.nome ? " border-red-400 focus:border-red-400" : ""}`}
                      {...register("nome")}
                    />
                    {errors.nome && (
                      <p className="mt-1.5 text-sm text-red-500" data-testid="nome-error">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="telefone" className="mb-2 block text-sm font-bold text-[#1C1917]">
                      WhatsApp
                    </label>
                    <input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      data-testid="telefone-input"
                      className={`${inputClass}${errors.telefone ? " border-red-400 focus:border-red-400" : ""}`}
                      {...register("telefone")}
                    />
                    {errors.telefone && (
                      <p className="mt-1.5 text-sm text-red-500" data-testid="telefone-error">
                        {errors.telefone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#1C1917]">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@restaurante.com"
                    autoComplete="email"
                    data-testid="register-email-input"
                    className={`${inputClass}${errors.email ? " border-red-400 focus:border-red-400" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500" data-testid="register-email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="senha" className="mb-2 block text-sm font-bold text-[#1C1917]">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        id="senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        data-testid="register-password-input"
                        className={`${inputClass} pr-12${errors.senha ? " border-red-400 focus:border-red-400" : ""}`}
                        {...register("senha")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D8780] transition-colors hover:text-[#1C1917]"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="mt-1.5 text-sm text-red-500" data-testid="register-password-error">
                        {errors.senha.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmarSenha" className="mb-2 block text-sm font-bold text-[#1C1917]">
                      Confirmar
                    </label>
                    <input
                      id="confirmarSenha"
                      type="password"
                      placeholder="••••••••"
                      data-testid="confirm-password-input"
                      className={`${inputClass}${errors.confirmarSenha ? " border-red-400 focus:border-red-400" : ""}`}
                      {...register("confirmarSenha")}
                    />
                    {errors.confirmarSenha && (
                      <p className="mt-1.5 text-sm text-red-500" data-testid="confirm-password-error">
                        {errors.confirmarSenha.message}
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    data-testid="terms-checkbox"
                    className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#FF5C0A]"
                  />
                  <span className="text-sm leading-relaxed text-[#625A53]">
                    Aceito os{" "}
                    <Link href="/termos-de-uso" className="font-bold text-[#FF5C0A] hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link href="/politica-de-privacidade" className="font-bold text-[#FF5C0A] hover:underline">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="submit-register-button"
                  className="mt-5 flex h-[56px] w-full items-center justify-center gap-3 rounded-lg bg-[#FF5C0A] text-lg font-bold tracking-[0.04em] text-white shadow-[0_22px_40px_rgba(234,88,12,0.22)] transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Criando conta..." : "CRIAR CONTA GRÁTIS"}
                  {!isSubmitting && <ArrowRight className="h-5 w-5" aria-hidden />}
                </button>
              </form>

              <p className="mt-7 text-center text-lg text-[#625A53]">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-bold text-[#FF5C0A] hover:underline">
                  Entrar
                </Link>
              </p>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#8D8780]">
                <ShieldCheck className="h-4 w-4 text-[#FF5C0A]" aria-hidden />
                <span>Conexão segura · seus dados são criptografados</span>
              </div>
            </div>
          </div>

          <footer className="pt-6 text-base text-[#8D8780]">
            © 2026 MeVêUm · Sistema para restaurantes brasileiros
          </footer>
        </section>

        <AuthCarousel />
      </div>
    </main>
  );
}
