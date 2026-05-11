import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusPedidoBadge } from "@/components/shared/StatusPedidoBadge";
import type { StatusPedido } from "@/types";

describe("StatusPedidoBadge", () => {
  const casos: { status: StatusPedido; label: string }[] = [
    { status: "recebido", label: "Recebido" },
    { status: "em_preparo", label: "Em preparo" },
    { status: "pronto", label: "Pronto" },
    { status: "saiu_entrega", label: "Saiu p/ entrega" },
    { status: "finalizado", label: "Finalizado" },
    { status: "cancelado", label: "Cancelado" },
  ];

  casos.forEach(({ status, label }) => {
    it(`deve exibir label "${label}" para status "${status}"`, () => {
      render(<StatusPedidoBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
