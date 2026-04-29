import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Motion } from "@/types/Motion";
import { Round } from "@/types/Round";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchClientSide = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const input =
    process.env.NODE_ENV === "production"
      ? `${process.env["NEXT_PUBLIC_API_URL"]}${path}`
      : `http://localhost:2023${path}`;
  return fetch(input, {
    credentials: "include",
    ...init,
  });
};

export const fetchServerside = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const input = `http://localhost:2023${path}`;
  return fetch(input, {
    credentials: "include",
    ...init,
  });
};

{
  /* Create Motion */
}

export async function createMotion(
  tournamentId: string,
  round: Round,
  motionData: Motion,
) {
  const isUpdate = !!round.motion_id;
  const method = isUpdate ? "PATCH" : "POST";
  const path = `/tournaments/${tournamentId}/motions`;

  const response = await fetchServerside(path, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(motionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${method} motion: ${response.statusText}`);
  }

  return await response.json();
}

{
  /* Create Round */
}

export async function createRound(
  tournamentId: string,
  roundData: Partial<Round>,
) {
  const path = `/tournaments/${tournamentId}/rounds`;

  const response = await fetchServerside(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roundData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create round: ${response.statusText}`);
  }

  return await response.json();
}
