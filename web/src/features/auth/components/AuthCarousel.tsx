"use client";

import { useState } from "react";
import { ChartColumn, MessageCircle, QrCode, Star } from "lucide-react";

const SLIDES = [
  {
    icon: QrCode,
    category: "Cardápio digital",
    title: "Seu cardápio com QR Code, em minutos.",
    description:
      "Personalize fotos, categorias e preços. Ative a sua loja em uma URL exclusiva como meveum.com.br/sua-loja.",
    badge: "QR Code e loja online",
  },
  {
    icon: MessageCircle,
    category: "WhatsApp organizado",
    title: "Pedidos chegam prontos no seu WhatsApp.",
    description:
      "Mensagens estruturadas, dados do cliente e endereço, sem trocar 20 mensagens por pedido.",
    badge: "Pedido organizado",
  },
  {
    icon: ChartColumn,
    category: "Dashboard operacional",
    title: "Você comanda a operação inteira de um lugar só.",
    description:
      "Faturamento, produtos mais vendidos, horários de pico e status da cozinha em tempo real.",
    badge: "Operação em tempo real",
  },
  {
    icon: Star,
    category: "Venda direta",
    title: "Venda pelo WhatsApp, sem comissão de marketplace.",
    description:
      "Centralize cardápio, pedidos e gestão em uma experiência pensada para restaurantes brasileiros.",
    badge: "Gestão e pedidos em um só lugar",
  },
];

export function AuthCarousel() {
  const [active, setActive] = useState(3);

  return (
    <aside className="relative hidden h-full min-h-[560px] overflow-hidden rounded-[28px] bg-[#1C1917] text-white shadow-[0_24px_70px_rgba(28,25,23,0.16)] lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(234,88,12,0.33),transparent_32%),radial-gradient(circle_at_86%_86%,rgba(245,158,11,0.27),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(234,88,12,0.08),transparent_45%)]" />
      <div className="bg-grain absolute inset-0 opacity-15" />

      <div className="relative flex h-full min-h-[560px] flex-col justify-between px-10 py-8 xl:px-14 xl:py-10">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C0A]" />
            Por que MeVêUm
          </span>
          <span className="text-sm font-medium tracking-[0.18em] text-white/60">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative min-h-[330px]">
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
                <div className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-[#FF5C0A] text-white shadow-[0_18px_42px_rgba(234,88,12,0.24)]">
                  <SlideIcon className="h-5 w-5" aria-hidden />
                </div>

                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FACC15]">
                  {slide.category}
                </p>

                <h2 className="mt-3 font-display text-[28px] font-semibold leading-[1.16] tracking-normal text-white xl:text-[31px]">
                  {slide.title}
                </h2>

                <p className="mt-4 max-w-[430px] text-sm font-medium leading-relaxed text-white/64 xl:text-base">
                  {slide.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/68">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C0A]" />
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

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C0A]" />
            Sem comissão de marketplace
          </span>
        </div>
      </div>
    </aside>
  );
}
