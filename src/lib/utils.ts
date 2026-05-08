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
  motionData: Partial<Motion>,
): Promise<Motion> {
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

export async function setRoundMotion(
  round: Round,
  motion_id: string,
  tournamentId: string,
) {
  const path = `/tournaments/${tournamentId}/phases/${round.phase_id}/rounds/${round.id}`;

  const response = await fetchClientSide(path, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ motion_id }),
  });

  if (!response.ok) {
    throw new Error(`Failed to patch round: ${await response.text()}`);
  }

  return response.json();
}
