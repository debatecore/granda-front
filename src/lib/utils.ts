import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const base = process.env.SERVER_URL ?? "http://localhost:2023";
  const input = `${base}${path}`;
  console.log("BAJOJAJO");
  console.log(input);
  return fetch(input, {
    credentials: "include",
    ...init,
  });
};
