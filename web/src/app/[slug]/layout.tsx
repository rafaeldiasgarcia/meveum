import { CarrinhoProvider } from "@/features/cardapio-publico/context/CarrinhoContext";
import type { ReactNode } from "react";

export default function CardapioPublicoLayout({ children }: { children: ReactNode }) {
  return <CarrinhoProvider>{children}</CarrinhoProvider>;
}
