"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCarousel } from "@/features/auth/components/AuthCarousel";
import { cadastroSchema, type CadastroFormData } from "@/lib/validations/auth.schema";
import { cadastrar } from "@/lib/api/auth.api";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ resolver: zodResolver(cadastroSchema) });

  async function onSubmit(data: CadastroFormData) {
    try {
      await cadastrar(data);
      toast.success("Conta criada! Bem-vindo ao MeVêUm.");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo — formulário */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12 lg:max-w-lg overflow-y-auto">
        <div className="mb-6">
          <Logo className="mb-6" />
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Criar conta grátis</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Já tem conta?{" "}
            <Link href="/login" className="text-[var(--color-orange)] hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>

        <div className="mb-5 rounded-[var(--radius-md)] border border-[var(--color-orange)]/20 bg-[var(--color-orange-dim)] p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-orange)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Grátis por 30 dias · Sem cartão de crédito
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="register-form" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Seu nome</Label>
              <Input
                id="nome"
                placeholder="Carlos Mendes"
                data-testid="nome-input"
                {...register("nome")}
                error={errors.nome?.message}
              />
              {errors.nome && (
                <p className="text-xs text-red-400" data-testid="nome-error">{errors.nome.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nomeLoja">Nome do restaurante</Label>
              <Input
                id="nomeLoja"
                placeholder="Burguer do Carlos"
                data-testid="nome-loja-input"
                {...register("nomeLoja")}
                error={errors.nomeLoja?.message}
              />
              {errors.nomeLoja && (
                <p className="text-xs text-red-400">{errors.nomeLoja.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefone">WhatsApp da loja</Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              data-testid="telefone-input"
              {...register("telefone")}
              error={errors.telefone?.message}
            />
            {errors.telefone && (
              <p className="text-xs text-red-400">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@restaurante.com"
              autoComplete="email"
              data-testid="register-email-input"
              {...register("email")}
              error={errors.email?.message}
            />
            {errors.email && (
              <p className="text-xs text-red-400" data-testid="register-email-error">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                data-testid="register-password-input"
                {...register("senha")}
                error={errors.senha?.message}
              />
              {errors.senha && (
                <p className="text-xs text-red-400">{errors.senha.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="••••••••"
                data-testid="confirm-password-input"
                {...register("confirmarSenha")}
                error={errors.confirmarSenha?.message}
              />
              {errors.confirmarSenha && (
                <p className="text-xs text-red-400" data-testid="confirm-password-error">{errors.confirmarSenha.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            data-testid="submit-register-button"
          >
            Criar conta grátis
          </Button>

          <p className="text-center text-xs text-[var(--color-muted)]">
            Ao criar conta você concorda com os{" "}
            <a href="#" className="text-[var(--color-orange)] hover:underline">Termos de Uso</a>
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
