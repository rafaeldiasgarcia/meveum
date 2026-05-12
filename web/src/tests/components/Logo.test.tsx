import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/shared/Logo";

describe("Logo", () => {
  it("deve renderizar a marca", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "MeVêUm" })).toBeInTheDocument();
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
