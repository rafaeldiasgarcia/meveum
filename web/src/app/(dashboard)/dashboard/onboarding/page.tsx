"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Store, Clock, Truck, CreditCard, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buscarOnboarding, concluirEtapa, pularOnboarding } from "@/lib/api/onboarding.api";
import type { EtapaOnboarding, OnboardingStatus } from "@/types";

const ETAPAS: { id: EtapaOnboarding; titulo: string; descricao: string; icon: React.ElementType; href: string }[] = [
  {
    id: "dados_loja",
    titulo: "Dados da loja",
    descricao: "Nome, telefone, endereço e informações básicas",
    icon: Store,
    href: "/dashboard/configuracoes",
  },
  {
    id: "horarios",
    titulo: "Horário de funcionamento",
    descricao: "Configure os dias e horários que sua loja funciona",
    icon: Clock,
    href: "/dashboard/configuracoes",
  },
  {
    id: "entrega_retirada",
    titulo: "Entrega e retirada",
    descricao: "Áreas de entrega, taxas e opção de retirada no local",
    icon: Truck,
    href: "/dashboard/configuracoes/entrega",
  },
  {
    id: "pagamentos",
    titulo: "Formas de pagamento",
    descricao: "PIX, cartão e dinheiro aceitos no seu cardápio",
    icon: CreditCard,
    href: "/dashboard/configuracoes/pagamentos",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus>({ etapasCompletas: [], concluido: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarOnboarding()
      .then((s) => {
        setStatus(s);
        if (s.concluido) router.replace("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function irParaEtapa(etapa: EtapaOnboarding, href: string) {
    await concluirEtapa(etapa).catch(() => null);
    router.push(href);
  }

  async function pular() {
    await pularOnboarding();
    toast.success("Onboarding ignorado. Você pode configurar depois em Configurações.");
    router.push("/dashboard");
  }

  const etapasCompletas = status.etapasCompletas.length;
  const total = ETAPAS.length;
  const progresso = Math.round((etapasCompletas / total) * 100);

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="onboarding-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-orange)] text-white text-2xl font-bold mx-auto">
          M
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Configure sua loja</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Complete as etapas abaixo para que seus clientes possam fazer pedidos.
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1.5" data-testid="onboarding-progresso">
        <div className="flex justify-between text-xs text-[var(--color-muted)]">
          <span>{etapasCompletas} de {total} etapas</span>
          <span>{progresso}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border)]">
          <div
            className="h-2 rounded-full bg-[var(--color-orange)] transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Etapas */}
      <div className="space-y-2" data-testid="onboarding-etapas">
        {ETAPAS.map((etapa, idx) => {
          const completa = status.etapasCompletas.includes(etapa.id);
          const Icon = etapa.icon;
          return (
            <Card
              key={etapa.id}
              className={completa ? "opacity-70" : ""}
              data-testid={`onboarding-etapa-${etapa.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      completa
                        ? "bg-green-500/15 text-green-500"
                        : "bg-[var(--color-orange)]/10 text-[var(--color-orange)]"
                    }`}
                  >
                    {completa ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">{etapa.titulo}</p>
                      {completa && (
                        <span className="text-[10px] font-medium text-green-500 bg-green-500/10 rounded-full px-2 py-0.5">
                          Concluído
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{etapa.descricao}</p>
                  </div>
                  <Button
                    variant={completa ? "secondary" : "default"}
                    size="sm"
                    onClick={() => irParaEtapa(etapa.id, etapa.href)}
                    data-testid={`onboarding-etapa-${etapa.id}-button`}
                    className="shrink-0"
                  >
                    {completa ? "Rever" : "Configurar"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        {etapasCompletas === total ? (
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            data-testid="onboarding-concluir-button"
            className="w-full"
          >
            <Check className="h-4 w-4" /> Ir para o painel
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={pular}
            data-testid="onboarding-pular-button"
            className="text-[var(--color-muted)]"
          >
            <SkipForward className="h-4 w-4" /> Pular por agora
          </Button>
        )}
        <p className="text-xs text-[var(--color-muted)] text-center">
          Você pode retornar a estas configurações a qualquer momento em{" "}
          <button
            onClick={() => router.push("/dashboard/configuracoes")}
            className="underline hover:text-[var(--color-foreground)]"
          >
            Configurações
          </button>.
        </p>
      </div>
    </div>
  );
}
