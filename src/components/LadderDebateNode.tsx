import { Debate } from "@/types/Debate";

export function LadderDebateNode({ debate }: { debate: Debate }) {
  return <p>{debate.id.substring(32, 34)}</p>;
}
