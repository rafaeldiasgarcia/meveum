"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Chrome, Apple } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCarousel } from "@/features/auth/components/AuthCarousel";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { login } from "@/lib/api/auth.api";

export default function LoginPage() {
  const router = useRouter();
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
    <div className="flex min-h-screen">
      {/* Lado esquerdo — formulário */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12 lg:max-w-lg">
        <div className="mb-8">
          <Logo className="mb-8" />
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Entrar na sua conta</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Sem conta?{" "}
            <Link href="/register" className="text-[var(--color-orange)] hover:underline font-medium">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        {/* Social logins */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          {[
            { icon: Chrome, label: "Google" },
            { icon: Github, label: "GitHub" },
            { icon: Apple, label: "Apple" },
          ].map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              className="flex items-center justify-center gap-1.5"
              onClick={() => toast.info(`Login com ${label} em breve`)}
              type="button"
              data-testid={`social-login-${label.toLowerCase()}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{label}</span>
            </Button>
          ))}
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--color-background)] px-2 text-xs text-[var(--color-muted)]">ou entre com e-mail</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="login-form" className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@restaurante.com"
              autoComplete="email"
              data-testid="email-input"
              {...register("email")}
              error={errors.email?.message}
            />
            {errors.email && (
              <p className="text-xs text-red-400" data-testid="email-error">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              <a href="#" className="text-xs text-[var(--color-orange)] hover:underline">Esqueci minha senha</a>
            </div>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              data-testid="password-input"
              {...register("senha")}
              error={errors.senha?.message}
            />
            {errors.senha && (
              <p className="text-xs text-red-400" data-testid="password-error">{errors.senha.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            data-testid="submit-login-button"
          >
            Entrar
          </Button>

          <p className="text-center text-xs text-[var(--color-muted)]">
            Use <span className="text-[var(--color-foreground)] font-mono">demo@meveum.com.br</span> · senha{" "}
            <span className="text-[var(--color-foreground)] font-mono">demo1234</span> para testar
          </p>
        </form>
      </div>

      {/* Lado direito — carrossel */}
      <div className="hidden lg:flex flex-1 border-l border-[var(--color-border)] bg-[var(--color-surface)]">
        <AuthCarousel />
      </div>
    </div>
  );
}
