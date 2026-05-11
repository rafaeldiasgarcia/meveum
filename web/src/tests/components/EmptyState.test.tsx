import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UtensilsCrossed } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

describe("EmptyState", () => {
  it("deve exibir título e descrição", () => {
    render(
      <EmptyState
        icon={UtensilsCrossed}
        titulo="Nenhum produto"
        descricao="Adicione produtos ao cardápio"
        data-testid="cardapio-empty-state"
      />
    );
    expect(screen.getByTestId("cardapio-empty-state")).toBeInTheDocument();
    expect(screen.getByText("Nenhum produto")).toBeInTheDocument();
    expect(screen.getByText("Adicione produtos ao cardápio")).toBeInTheDocument();
  });

  it("deve renderizar ação quando fornecida", async () => {
    const user = userEvent.setup();
    let clicado = false;
    render(
      <EmptyState
        icon={UtensilsCrossed}
        titulo="Vazio"
        acao={<button onClick={() => { clicado = true; }} data-testid="acao-button">Criar produto</button>}
      />
    );
    await user.click(screen.getByTestId("acao-button"));
    expect(clicado).toBe(true);
  });

  it("não deve exibir descrição quando não fornecida", () => {
    render(<EmptyState icon={UtensilsCrossed} titulo="Nenhum item" />);
    // Título está presente mas nenhuma descrição adicional
    expect(screen.getByText("Nenhum item")).toBeInTheDocument();
    expect(screen.queryByText(/adicione/i)).not.toBeInTheDocument();
  });
});
