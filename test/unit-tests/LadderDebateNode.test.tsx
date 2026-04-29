import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LadderDebateNode } from "../../src/components/ui/LadderDebateNode";

const mockDebate = { id: "1", tournament_id: "t1" };

describe("LadderDebateNode", () => {
  it("satisfies SCRUM-69 requirements", () => {
    const longText = "A".repeat(100);
    const { rerender } = render(
      <LadderDebateNode isFinals={false} debate={mockDebate as any} display_text={longText} />
    );

    // 1. Link & Pointer
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/t/t1/debates/1");
    expect(link).toHaveClass("cursor-pointer");

    // 2. Truncation with …
    expect(screen.getByText(/…/)).toBeInTheDocument();

    // 3. Variant swap
    rerender(
      <LadderDebateNode isFinals={true} debate={mockDebate as any} display_text="Final" />
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});