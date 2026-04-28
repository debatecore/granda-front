type Phase = {
  id: string;
  name: string;
  tournament_id: string;
  previous_phase_id?: string;
  group_size?: number;
  is_finals: boolean;
  status: "Planned" | "Ongoing" | "Finished";
};

export type { Phase };
