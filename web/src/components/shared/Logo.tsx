import { cn } from "@/lib/utils/cn";

type Props = { className?: string; size?: "sm" | "md" | "lg"; showTag?: boolean };

export function Logo({ className, size = "md", showTag = false }: Props) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "rounded-[var(--radius-md)] bg-[var(--color-orange)] flex items-center justify-center font-black text-white leading-none",
            size === "sm" && "w-7 h-7 text-sm",
            size === "md" && "w-8 h-8 text-base",
            size === "lg" && "w-11 h-11 text-xl"
          )}
        >
          M
        </div>
      </div>
      <span
        className={cn(
          "font-bold text-[var(--color-foreground)] tracking-tight",
          sizes[size]
        )}
      >
        Me<span className="text-[var(--color-orange)]">Vê</span>Um
      </span>
      {showTag && (
        <span className="text-[10px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] rounded px-1.5 py-0.5 hidden sm:inline">
          beta
        </span>
      )}
    </div>
  );
}
