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
      className="sticky top-0 z-30 overflow-x-auto bg-[#FBF7F4]/90 py-3 backdrop-blur-md md:py-4"
      data-testid="public-categories-nav"
    >
      <div className="flex gap-3 px-4 md:px-10 lg:px-14">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollParaCategoria(cat.id)}
            data-testid={`public-category-${cat.id}`}
            className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              ativa === cat.id
                ? "bg-[#EA580C] text-white shadow-lg shadow-[#EA580C]/30"
                : "border border-[#E8E0D6]/70 bg-[#FBF7F4] text-[#1C1917] hover:bg-[#F5EFE8]"
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </nav>
  );
}
