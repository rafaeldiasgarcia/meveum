"use client";

import { useState } from "react";
import { ChartColumn, MessageCircle, QrCode, Sparkles, Star } from "lucide-react";

const SLIDES = [
  {
    icon: QrCode,
    category: "Cardápio digital",
    title: "Seu cardápio com QR Code, em minutos.",
    description:
      "Personalize fotos, categorias e preços. Ative a sua loja em uma URL exclusiva como meveum.com.br/sua-loja.",
    badge: "+38% no ticket médio",
  },
  {
    icon: MessageCircle,
    category: "WhatsApp organizado",
    title: "Pedidos chegam prontos no seu WhatsApp.",
    description:
      "Mensagens estruturadas, dados do cliente e endereço, sem trocar 20 mensagens por pedido.",
    badge: "0 pedido perdido",
  },
  {
    icon: ChartColumn,
    category: "Dashboard operacional",
    title: "Você comanda a operação inteira de um lugar só.",
    description:
      "Faturamento, produtos mais vendidos, horários de pico e status da cozinha em tempo real.",
    badge: "Tudo em tempo real",
  },
  {
    icon: Star,
    category: "Restaurantes que confiam",
    title: '"Em 30 dias dobramos os pedidos pelo WhatsApp."',
    description:
      "Mais de 2.000 restaurantes brasileiros usam o MeVêUm para vender direto, sem comissão de marketplace.",
    badge: "4,9 ★ avaliação média",
  },
];

export function AuthCarousel() {
  const [active, setActive] = useState(3);

  return (
    <aside className="relative hidden h-full min-h-screen overflow-hidden bg-[#1C1917] text-white lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(234,88,12,0.33),transparent_32%),radial-gradient(circle_at_86%_86%,rgba(245,158,11,0.27),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(234,88,12,0.08),transparent_45%)]" />
      <div className="bg-grain absolute inset-0 opacity-15" />

      <div className="relative flex h-full min-h-screen flex-col justify-between px-12 py-10 xl:px-20 xl:py-16">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-sm font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#FF5C0A]" />
            Por que MeVêUm
          </span>
          <span className="text-sm font-medium tracking-[0.18em] text-white/60">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative min-h-[420px]">
          {SLIDES.map((slide, index) => {
            const SlideIcon = slide.icon;
            const isActive = index === active;

            return (
              <article
                key={slide.title}
                aria-hidden={!isActive}
                className={`absolute left-0 top-1/2 w-full max-w-[560px] -translate-y-1/2 transition-all duration-500 ${
                  isActive ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
                }`}
              >
                <div className="inline-grid h-[62px] w-[62px] place-items-center rounded-[22px] bg-[#FF5C0A] text-white shadow-[0_20px_50px_rgba(234,88,12,0.35)]">
                  <SlideIcon className="h-7 w-7" aria-hidden />
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.32em] text-[#FACC15]">
                  {slide.category}
                </p>

                <h2 className="mt-5 font-display text-[40px] font-bold leading-[1.18] tracking-normal text-white xl:text-[44px]">
                  {slide.title}
                </h2>

                <p className="mt-6 max-w-[520px] text-xl font-semibold leading-relaxed text-white/68">
                  {slide.description}
                </p>

                <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                  <Sparkles className="h-5 w-5 text-[#FF5C0A]" aria-hidden />
                  {slide.badge}
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Ir para slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? "w-10 bg-[#FF5C0A]" : "w-5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center">
            <div className="flex -space-x-3">
              <span className="h-11 w-11 rounded-full border-2 border-[#1C1917] bg-[#FF9F1C] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
              <span className="h-11 w-11 rounded-full border-2 border-[#1C1917] bg-[#FFB020] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
              <span className="h-11 w-11 rounded-full border-2 border-[#1C1917] bg-[#FF5C0A] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
            </div>
            <span className="ml-3 text-sm font-semibold text-white/75">+2.000 restaurantes</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
