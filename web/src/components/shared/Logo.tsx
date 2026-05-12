import { cn } from "@/lib/utils/cn";

type Props = { className?: string; size?: "sm" | "md" | "lg"; showTag?: boolean };

export function Logo({ className, size = "md", showTag = false }: Props) {
  const sizes = {
    sm: "h-8 w-[86px]",
    md: "h-10 w-[108px]",
    lg: "h-14 w-[150px]",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="MeVêUm"
        className={cn("object-contain", sizes[size])}
      />
      {showTag && (
        <span className="text-[10px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] rounded px-1.5 py-0.5 hidden sm:inline">
          beta
        </span>
      )}
    </div>
  );
}
