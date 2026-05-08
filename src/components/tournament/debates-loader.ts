import { fetchServerside } from "@/lib/utils";
import { Debate } from "@/types/Debate";
import { cookies } from "next/headers";

type LoadDebatesResult = {
  debates: Debate[];
  loadError: boolean;
};

const loadDebates = async (
  tournamentId: string,
): Promise<LoadDebatesResult> => {
  const res = await fetchServerside(`/tournaments/${tournamentId}/debates`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (!res.ok) {
    return {
      debates: [],
      loadError: true,
    };
  }

  return {
    debates: await res.json(),
    loadError: false,
  };
};

export { loadDebates };
export type { LoadDebatesResult };
