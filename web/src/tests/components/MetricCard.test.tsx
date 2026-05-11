import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShoppingBag } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

describe("MetricCard", () => {
  it("deve exibir o label e o valor corretamente", () => {
    render(<MetricCard label="Pedidos hoje" value="23" icon={ShoppingBag} data-testid="metric-card-orders-today" />);
    expect(screen.getByTestId("metric-card-orders-today")).toBeInTheDocument();
    expect(screen.getByText("Pedidos hoje")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
  });

  it("deve exibir variação positiva em verde", () => {
    render(<MetricCard label="Faturamento" value="R$ 1.000" icon={ShoppingBag} variacao={12} />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs. ontem")).toBeInTheDocument();
  });

  it("deve exibir variação negativa em vermelho", () => {
    render(<MetricCard label="Faturamento" value="R$ 800" icon={ShoppingBag} variacao={-5} />);
    expect(screen.getByText("-5%")).toBeInTheDocument();
  });

  it("deve exibir descrição quando fornecida", () => {
    render(<MetricCard label="Em preparo" value="4" icon={ShoppingBag} descricao="pedidos na cozinha" />);
    expect(screen.getByText("pedidos na cozinha")).toBeInTheDocument();
  });

  it("não deve exibir variação quando não fornecida", () => {
    render(<MetricCard label="Ticket médio" value="R$ 80" icon={ShoppingBag} />);
    expect(screen.queryByText("vs. ontem")).not.toBeInTheDocument();
  });
});
