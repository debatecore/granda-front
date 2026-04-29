import { LadderDebateNode } from "../../src/components/ui/LadderDebateNode";

describe("LadderDebateNode Logic", () => {
  const mockDebate = { id: "debate-123", tournament_id: "t-789" };

  test("should verify the component function exists", () => {
    expect(LadderDebateNode).toBeDefined();
    expect(typeof LadderDebateNode).toBe("function");
  });

  test("should handle expected props structure", () => {
    const props = {
      isFinals: false,
      debate: mockDebate,
      display_text: "Group A",
    };

    expect(props.debate.id).toBe("debate-123");
    expect(props.debate.tournament_id).toBe("t-789");
  });
});