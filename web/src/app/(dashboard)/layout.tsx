import { DashboardShell } from "@/features/auth/components/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
