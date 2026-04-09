import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_PORT = process.env.BACKEND_PORT
  ? process.env.BACKEND_PORT
  : "2023";
const BACKEND_SOCKET_ADDRESS =
  process.env.NODE_ENV === "production"
    ? `http://server-prod:${BACKEND_PORT}`
    : `http://127.0.0.1:${BACKEND_PORT}`;

export const fetchClientSide = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  return fetch(`${BACKEND_SOCKET_ADDRESS}${path}`, {
    credentials: "include",
    ...init,
  });
};

export const fetchServerside = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const input = `${BACKEND_SOCKET_ADDRESS}${path}`;
  return fetch(input, {
    credentials: "include",
    ...init,
  });
};
