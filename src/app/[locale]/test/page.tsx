import { RoundConfig } from "@/components/ui/RoundConfig";
import type { Round } from "@/types/Round";

export default function Page() {
  const round: Round = {
    id: "1",
    name: "Round 1",
    motion_id: null,
  };

  return <RoundConfig name="Test" tournamentId="test-id" round={round} />;
}
