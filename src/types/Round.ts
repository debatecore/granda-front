type Round = {
  id: string;
  name: string;
  phase_id: string;
  planned_end_time?: Date;
  planned_start_time?: Date;
  previous_round_id: string;
  status: "Planned" | "Ongoing" | "Finished";
};

export type { Round };
