"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SessaoAutenticadaProvider, useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";

function DashboardShellContent({ children }: { children: React.ReactNode }) {
  const { carregando, usuario } = useSessaoAutenticada();

  if (carregando && !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SessaoAutenticadaProvider>
      <DashboardShellContent>{children}</DashboardShellContent>
    </SessaoAutenticadaProvider>
  );
}
