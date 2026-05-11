import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/shared/Logo";

describe("Logo", () => {
  it("deve renderizar o nome da marca", () => {
    render(<Logo />);
    // "MeVêUm" é dividido em spans, então buscamos as partes individualmente
    expect(screen.getByText("Me", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Vê")).toBeInTheDocument();
    expect(screen.getByText("Um", { exact: false })).toBeInTheDocument();
  });

  it("deve exibir tag beta quando showTag=true", () => {
    render(<Logo showTag />);
    expect(screen.getByText("beta")).toBeInTheDocument();
  });

  it("não deve exibir tag beta por padrão", () => {
    render(<Logo />);
    expect(screen.queryByText("beta")).not.toBeInTheDocument();
  });
});
