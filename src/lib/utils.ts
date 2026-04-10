import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TO-DO: figure out how to pass env variables to the container
// (it doesn't seem to work)
const INTERNAL_BACKEND_SOCKET = process.env.INTERNAL_BACKEND_SOCKET
  ? process.env.INTERNAL_BACKEND_SOCKET
  : "http://server-prod:2023";
const BACKEND_SOCKET = process.env.BACKEND_SOCKET
  ? process.env.BACKEND_SOCKET
  : "http://localhost:2023";

export const fetchClientSide = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  console.log(BACKEND_SOCKET);
  return fetch(`${BACKEND_SOCKET}${path}`, {
    credentials: "include",
    ...init,
  });
};

export const fetchServerside = async (
  path: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const input = `${INTERNAL_BACKEND_SOCKET}${path}`;
  return fetch(input, {
    credentials: "include",
    ...init,
  });
};
