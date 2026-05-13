"use client";

import { useState, useEffect } from "react";
import { QrCode, MessageCircle, BarChart3, Star } from "lucide-react";

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
    icon: BarChart3,
    category: "ANALYTICS",
    title: "Métricas que fazem seu negócio crescer.",
    description:
      "Faturamento, ticket médio e itens mais vendidos — dados em tempo real para decisões certeiras.",
    badge: "+52% de receita",
  },
  {
    icon: Star,
    category: "AVALIAÇÕES",
    title: "Clientes satisfeitos voltam sempre.",
    description:
      "Acompanhe o feedback dos clientes, mantenha a qualidade e construa uma base fiel de recorrentes.",
    badge: "4.9 ★ avaliação média",
  },
];

const AVATARS = [
  "linear-gradient(135deg,#EA580C,#C2410C)",
  "linear-gradient(135deg,#F97316,#EA580C)",
  "linear-gradient(135deg,#FBB040,#F97316)",
];

export function AuthCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="relative hidden overflow-hidden bg-[#1C1917] text-white lg:block">
      {/* Grain texture overlay */}
      <div className="bg-grain absolute inset-0 opacity-[0.025]" />

      {/* Ember glow */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#EA580C] opacity-[0.12] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#F59E0B] opacity-[0.07] blur-3xl" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
          <span className="text-xs font-medium text-white/80">Por que MeVêUm</span>
        </div>
        <span className="text-xs font-medium text-white/40">
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Slides — all rendered, only active visible */}
      <div className="relative h-full">
        {SLIDES.map((s, i) => {
          const SlideIcon = s.icon;
          const isActive = i === active;
          return (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col justify-center px-10 py-20 transition-all duration-500 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EA580C]">
                <SlideIcon className="h-7 w-7 text-white" />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F59E0B]">
                {s.category}
              </p>

              <h2 className="mb-4 text-3xl font-bold leading-tight text-white">
                {s.title}
              </h2>

              <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/55">
                {s.description}
              </p>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2">
                <span className="text-sm">✨</span>
                <span className="text-sm font-medium text-white/80">{s.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 pb-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[#EA580C]" : "w-4 bg-white/25"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {AVATARS.map((bg, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-[#1C1917]"
                style={{ background: bg }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-white/50">+2.000 restaurantes</span>
        </div>
      </div>
    </aside>
  );
}
