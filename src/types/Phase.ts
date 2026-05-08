type Phase = {
  id: string;
  name: string;
  tournament_id: string;
  previous_phase_id: string | null;
  group_size: number | null;
  is_finals: boolean;
  status: "Planned" | "Ongoing" | "Finished";
};

export type { Phase };
