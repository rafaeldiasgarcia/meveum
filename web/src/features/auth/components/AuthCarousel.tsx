"use client";

import { useState, useEffect } from "react";
import { BarChart3, ClipboardList, UtensilsCrossed, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    icon: ClipboardList,
    titulo: "Pedidos chegando, organizados",
    descricao: "Cada pedido do WhatsApp ou QR Code aparece direto no painel, separado por status.",
    cor: "text-[var(--color-orange)]",
    bg: "bg-[var(--color-orange-dim)]",
  },
  {
    icon: UtensilsCrossed,
    titulo: "Cardápio digital no ar",
    descricao: "Monte seu cardápio, gere o QR Code e coloque nas mesas. Cliente pede sem precisar chamar garçom.",
    cor: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: MessageCircle,
    titulo: "WhatsApp integrado",
    descricao: "Sem ficar copiando pedido de mensagem em mensagem. Tudo chega organizado automaticamente.",
    cor: "text-[var(--color-green-wa)]",
    bg: "bg-[var(--color-green-wa-dim)]",
  },
  {
    icon: BarChart3,
    titulo: "Faturamento em tempo real",
    descricao: "Veja quanto você vendeu hoje, esta semana e este mês. Ticket médio e muito mais.",
    cor: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

export function AuthCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[active];
  const Icon = slide.icon;

  return (
    <div className="flex h-full flex-col items-center justify-center px-10 py-12">
      <div className="mb-8 text-center">
        <div className={cn("mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[var(--radius-xl)]", slide.bg)}>
          <Icon className={cn("h-10 w-10", slide.cor)} />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-[var(--color-foreground)]">{slide.titulo}</h2>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs mx-auto">{slide.descricao}</p>
      </div>

      <div className="flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-[var(--color-orange)]" : "w-1.5 bg-[var(--color-border)]"
            )}
          />
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 w-full max-w-xs">
        <div className="text-xs text-[var(--color-muted)] mb-2">Hoje · Smash Burguer do Centro</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-[var(--color-border)] p-2">
            <div className="text-xs text-[var(--color-muted)]">Pedidos</div>
            <div className="text-lg font-bold text-[var(--color-foreground)]">23</div>
          </div>
          <div className="rounded bg-[var(--color-orange-dim)] p-2 border border-[var(--color-orange)]/20">
            <div className="text-xs text-[var(--color-muted)]">Faturamento</div>
            <div className="text-lg font-bold text-[var(--color-orange)]">R$ 1.847</div>
          </div>
        </div>
      </div>
    </div>
  );
}
