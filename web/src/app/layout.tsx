import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "MeVêUm — Seu restaurante organizado", template: "%s | MeVêUm" },
  description: "Sistema de gestão para restaurantes, lanchonetes e delivery. Cardápio digital, pedidos organizados e WhatsApp integrado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
