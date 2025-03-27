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
