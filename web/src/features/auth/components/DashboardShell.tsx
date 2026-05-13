"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SessaoAutenticadaProvider, useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";

function DashboardShellContent({ children }: { children: React.ReactNode }) {
  const { carregando, usuario } = useSessaoAutenticada();

  if (carregando && !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1c1917]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F6F3]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
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
