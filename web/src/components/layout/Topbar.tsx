"use client";

import { Bell, Store, ChevronDown } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

type Props = { nomeLoja?: string };

export function Topbar({ nomeLoja = "Smash Burguer do Centro" }: Props) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur px-4 md:px-6"
      data-testid="topbar"
    >
      <div className="md:hidden">
        <Logo size="sm" />
      </div>

      <div className="hidden md:flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <Store className="h-3.5 w-3.5 text-[var(--color-muted)]" />
        </div>
        <span className="text-sm font-medium text-[var(--color-foreground)]">{nomeLoja}</span>
        <div className="ml-1 h-2 w-2 rounded-full bg-green-400" title="Loja aberta" />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-orange)]" />
        </Button>

        <button
          className="flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors"
          data-testid="user-menu-button"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-orange)] text-xs font-bold text-white">
            B
          </div>
          <span className="hidden sm:block text-sm font-medium text-[var(--color-foreground)]">Bryan</span>
          <ChevronDown className="h-3 w-3 text-[var(--color-muted)]" />
        </button>
      </div>
    </header>
  );
}
