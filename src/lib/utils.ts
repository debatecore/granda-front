import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
