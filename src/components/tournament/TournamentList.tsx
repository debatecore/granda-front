import { fetchServerside } from "@/lib/utils";
import { Tournament } from "@/types/Tournament";
import { cookies } from "next/headers";
import Link from "next/link";
import MOW2024OlekFinal from "../../../public/S-MOW2024-olekfinal.jpg";
import MOW2024OlekRelief from "../../../public/S-MOW2024-olekrelief.jpg";

const TournamentsList = async () => {
  let data_tournaments: Tournament[] = [];
  const res = await fetchServerside("/tournament", {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });
  if (res.ok) {
    data_tournaments = await res.json();
  }

  return (
    <div className="mt-16 p-16 border-t border-b border-stone-700/70 overflow-y-scroll">
      {data_tournaments.length !== 0 ? (
        <div className="flex flex-col gap-4">
          {data_tournaments.map((tournament, i) => {
            return (
              <TournamentListItem
                key={tournament.id}
                tournament={tournament}
                indexForImage={i}
              />
            );
          })}
        </div>
      ) : (
        <>
          <p className="text-stone-500">
            {"There aren't any tournaments you're a part of yet."}
          </p>
        </>
      )}
    </div>
  );
};

const TournamentListItem = ({
  tournament,
  indexForImage,
}: {
  tournament: Tournament;
  indexForImage: number;
}) => {
  const backgrounds = [`${MOW2024OlekFinal.src}`, `${MOW2024OlekRelief.src}`];
  return (
    <Link href={`/t/${tournament.id}`}>
      <div
        className="relative rounded border border-stone-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgrounds[indexForImage % backgrounds.length]})`,
        }}
      >
        <div className="relative backdrop-blur-xs w-full h-full min-h-28 min-w-lg py-3 px-4 bg-black/75">
          <h2 className="text-xl font-semibold font-logo">
            {tournament.full_name}
          </h2>
          <p className="text-stone-300 font-semibold">
            {tournament.shortened_name}
          </p>
          <div className="absolute bottom-0 right-0">
            <p className="text-xs font-mono pr-[2px] pb-[1px] text-stone-500">
              {tournament.id}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { TournamentsList };
