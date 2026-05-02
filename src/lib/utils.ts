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
  return fetch(`/api${path}`, {
    credentials: "include",
    ...init,
  });
};

export const fetchServerside = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const base = process.env.BACKEND_URL ?? "http://localhost:2023";
  const input = `${base}${path}`;

  return fetch(input, {
    credentials: "include",
    ...init,
  });
};

export async function createMotion(
  tournamentId: string,
  round: Round,
  motionData: Motion,
) {
  const isUpdate = Boolean(round.motion_id);
  const method = isUpdate ? "PATCH" : "POST";
  const path = isUpdate
    ? `/tournaments/${tournamentId}/motions/${round.motion_id}`
    : `/tournaments/${tournamentId}/motions`;

  const response = await fetchClientSide(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(motionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${method} motion: ${response.statusText}`);
  }

  return response.json();
}

export async function createRound(
  tournamentId: string,
  roundData: Partial<Round>,
) {
  const path = `/tournaments/${tournamentId}/rounds`;

  const response = await fetchClientSide(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roundData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create round: ${response.statusText}`);
  }

  return response.json();
}
