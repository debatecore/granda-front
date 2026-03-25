"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createTournament } from "./actions";

const initialState = {
  success: false,
  error: null as string | null,
};

export function CreateTournamentButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createTournament,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      >
        Create tournament
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Create tournament
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-stone-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <form action={formAction} className="flex flex-col gap-4">
           <div className="flex flex-col">
  <label
    htmlFor="full_name"
    className="mb-1 text-sm text-stone-300"
  >
    Full name
  </label>
  <input
    id="full_name"
    type="text"
    name="full_name"
    required
    className="rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
  />
</div>

<div className="flex flex-col">
  <label
    htmlFor="shortened_name"
    className="mb-1 text-sm text-stone-300"
  >
    Short name
  </label>
  <input
    id="shortened_name"
    type="text"
    name="shortened_name"
    required
    className="rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
  />
</div>

              {state.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}