"use client";

import { useState, useEffect } from "react";
import { QrCode, MessageCircle, BarChart3, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    icon: QrCode,
    category: "CARDÁPIO DIGITAL",
    title: "Seu cardápio com QR Code, em minutos.",
    description:
      "Personalize fotos, categorias e preços. Ative a sua loja em uma URL exclusiva como meveum.com.br/sua-loja.",
    badge: "+38% no ticket médio",
  },
  {
    icon: MessageCircle,
    category: "WHATSAPP ORGANIZADO",
    title: "Pedidos chegam prontos no seu WhatsApp.",
    description:
      "Mensagens estruturadas, dados do cliente e endereço — sem trocar 20 mensagens por pedido.",
    badge: "0 pedido perdido",
  },
  {
    icon: UtensilsCrossed,
    category: "GESTÃO DE PEDIDOS",
    title: "Acompanhe cada pedido em tempo real.",
    description:
      "Do recebimento à entrega, visualize o status de cada pedido e mantenha toda a equipe sincronizada.",
    badge: "100% organizado",
  },
  {
    icon: BarChart3,
    category: "ANALYTICS",
    title: "Métricas que fazem seu negócio crescer.",
    description:
      "Faturamento, ticket médio e itens mais vendidos — dados em tempo real para decisões certeiras.",
    badge: "+52% de receita",
  },
];

const AVATARS = ["#EA580C", "#C2410C", "#F97316"];

export function AuthCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[active];
  const Icon = slide.icon;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 70% 55%, rgba(180,70,10,0.38) 0%, rgba(100,30,0,0.18) 42%, transparent 72%), #0f0700",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-8">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
          <span className="text-xs font-medium text-white/80">Por que MeVêUm</span>
        </div>
        <span className="text-xs font-medium text-white/40">
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-center px-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EA580C]">
          <Icon className="h-7 w-7 text-white" />
        </div>

        <p className="mb-3 text-xs font-semibold tracking-widest text-[#EA580C]">
          {slide.category}
        </p>

        <h2 className="mb-4 text-3xl font-bold leading-tight text-white">
          {slide.title}
        </h2>

        <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/55">
          {slide.description}
        </p>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2">
          <span className="text-sm">✨</span>
          <span className="text-sm font-medium text-white/80">{slide.badge}</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 pb-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-[#EA580C]" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {AVATARS.map((color, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-[#0f0700]"
                style={{ background: color, marginLeft: i > 0 ? "-8px" : "0" }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-white/50">+2.000 restaurantes</span>
        </div>
      </div>
    </div>
  );
}
