"use client";

import { useState, useEffect } from "react";
import { QrCode, MessageCircle, ChartColumn, Star, Sparkles } from "lucide-react";

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
      "Mensagens estruturadas, dados do cliente e endereço — sem trocar 20 mensagens por pedido.",
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
      "Restaurantes brasileiros vendem direto pelo MeVêUm, sem pagar comissão de marketplace.",
    badge: "4,9 ★ avaliação média",
  },
];

export function AuthCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="relative hidden overflow-hidden bg-charcoal text-white lg:block">
      {/* Grain */}
      <div className="bg-grain absolute inset-0 opacity-40" />

      {/* Glow circles */}
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-ember/30 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-warm/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Por que MeVêUm
          </span>
          <span className="text-xs text-white/50">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Slides */}
        <div className="relative my-10 min-h-[360px]">
          {SLIDES.map((s, i) => {
            const SlideIcon = s.icon;
            const isActive = i === active;
            return (
              <article
                key={i}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-all duration-700 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-ember text-white shadow-ember">
                  <SlideIcon className="h-5 w-5" aria-hidden />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber-warm">
                  {s.category}
                </p>

                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
                  {s.title}
                </h2>

                <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                  {s.description}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-ember" aria-hidden />
                  {s.badge}
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-ember" : "w-4 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
