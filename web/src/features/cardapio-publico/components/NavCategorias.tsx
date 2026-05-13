"use client";

import { useEffect, useRef, useState } from "react";
import type { CategoriaPublica } from "@/types/cardapio-publico";

type Props = { categorias: CategoriaPublica[] };

export function NavCategorias({ categorias }: Props) {
  const [ativa, setAtiva] = useState<string>(categorias[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAtiva(entry.target.id.replace("cat-", ""));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    categorias.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categorias]);

  function scrollParaCategoria(id: string) {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const offset = 60;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <nav
      ref={navRef}
      className="bg-[#FFF8F4] sticky top-0 z-20 overflow-x-auto scrollbar-none"
    >
      <div className="flex gap-2 px-4 py-3 max-w-2xl mx-auto">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollParaCategoria(cat.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              ativa === cat.id
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-900 border-gray-300 hover:border-orange-400"
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </nav>
  );
}
