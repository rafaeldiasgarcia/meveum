import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  icon: LucideIcon;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function EmptyState({ icon: Icon, titulo, descricao, acao, className, "data-testid": testId }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
      data-testid={testId}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]">
        <Icon className="h-7 w-7 text-[var(--color-muted)]" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-foreground)]">{titulo}</p>
        {descricao && <p className="text-sm text-[var(--color-muted)] max-w-xs">{descricao}</p>}
      </div>
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}
