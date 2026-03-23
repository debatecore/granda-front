import { redirect } from "next/navigation";
import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { Link } from "@/i18n/navigation";

export default function CreateTournamentPage() {
  async function createTournament(formData: FormData) {
    "use server";

    console.log("SERVER ACTION CALLED"); //

    const full_name = formData.get("full_name");
    const shortened_name = formData.get("shortened_name");

    const res = await fetchServerside("/tournaments", {
      method: "POST",
      headers: {
        Cookie: (await cookies()).toString(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        shortened_name,

        // valores default obrigatórios
        speech_time: 300,
        end_protected_time: 30,
        start_protected_time: 0,
        ad_vocem_time: 60,
        debate_time_slot: 120,
        debate_preparation_time: 15,
        beep_on_speech_end: true,
        beep_on_protected_time: true,
        visualize_protected_time: false,
      }),
    });

   if (res.ok) {
  redirect("/tournaments");
} else {
  const errorText = await res.text();
  console.error("Erro ao criar torneio");
  console.error("Status:", res.status);
  console.error("Response:", errorText);
}
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="mb-2 text-2xl font-semibold text-white">
          Create tournament
        </h1>

        <p className="mb-6 text-sm text-stone-400">
          Fill in the basic information to create a new tournament.
        </p>

        <form action={createTournament} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white">Tournament name</label>
            <input
              name="full_name"
              type="text"
              required
              className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-white">Short name</label>
            <input
              name="shortened_name"
              type="text"
              required
              className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-white/10 px-4 py-2 text-white"
            >
              Create
            </button>

            <Link href="/tournaments" className="underline text-stone-400">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
