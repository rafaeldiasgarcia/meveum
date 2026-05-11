"use client";

import type { DadoGrafico } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

type Props = { dados: DadoGrafico[] };

export function GraficoVendas({ dados }: Props) {
  const max = Math.max(...dados.map((d) => d.valor));

  return (
    <div data-testid="grafico-vendas" className="w-full">
      <div className="flex items-end gap-2 h-32 px-1">
        {dados.map(({ label, valor }) => {
          const pct = max > 0 ? (valor / max) * 100 : 0;
          const isToday = label === "Dom";
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="relative w-full group flex justify-center">
                <div
                  style={{ height: `${pct}%`, minHeight: 4 }}
                  className={`w-full rounded-sm transition-all ${
                    isToday
                      ? "bg-[var(--color-orange)]"
                      : "bg-[var(--color-surface-2)] group-hover:bg-[var(--color-orange)]/40"
                  }`}
                />
                <div className="absolute -top-7 hidden group-hover:flex text-[10px] font-medium text-[var(--color-foreground)] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                  {formatCurrency(valor)}
                </div>
              </div>
              <span className={`text-[10px] font-medium ${isToday ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
