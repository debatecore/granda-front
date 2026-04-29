type Debate = {
  id: string;
  marshal_user_id?: string;
  motion_id?: string;
  round_id: string;
  tournament_id: string;
};

export type { Debate };
export type Debate = {
  id: string;
  marshal_user_id: string | null;
  motion_id: string | null;
  round_id: string;
  tournament_id: string;
};