type User = {
  id: string;
  handle: string;
  profile_picture: string | null;
};

export type { User };

const UUID_MAX = "ffffffff-ffff-ffff-ffff-ffffffffffff";
export { UUID_MAX };