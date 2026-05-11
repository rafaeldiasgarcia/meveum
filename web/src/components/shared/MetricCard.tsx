import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  variacao?: number;
  descricao?: string;
  destaque?: boolean;
  "data-testid"?: string;
};

export function MetricCard({ label, value, icon: Icon, variacao, descricao, destaque, "data-testid": testId }: Props) {
  const positivo = variacao !== undefined && variacao >= 0;
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-colors hover:border-[var(--color-border)]",
        destaque && "border-[var(--color-orange)]/30 bg-[var(--color-orange-dim)]"
      )}
      data-testid={testId}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">{label}</span>
            <span className={cn("text-2xl font-bold", destaque ? "text-[var(--color-orange)]" : "text-[var(--color-foreground)]")}>
              {value}
            </span>
            {descricao && <span className="text-xs text-[var(--color-muted)]">{descricao}</span>}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
              destaque ? "bg-[var(--color-orange)]/20" : "bg-[var(--color-surface-2)]"
            )}
          >
            <Icon className={cn("h-5 w-5", destaque ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]")} />
          </div>
        </div>
        {variacao !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            {positivo ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            )}
            <span className={cn("text-xs font-medium", positivo ? "text-green-400" : "text-red-400")}>
              {positivo ? "+" : ""}{variacao}%
            </span>
            <span className="text-xs text-[var(--color-muted)]">vs. ontem</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
