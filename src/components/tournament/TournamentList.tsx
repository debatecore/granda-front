import { fetchServerside } from "@/lib/utils";
import { Tournament } from "@/types/Tournament";
import { cookies } from "next/headers";
import { Link } from "@/i18n/navigation";
import MOW2024OlekFinal from "../../../public/S-MOW2024-olekfinal.jpg";
import MOW2024OlekRelief from "../../../public/S-MOW2024-olekrelief.jpg";
import { GenericComponent } from "@/components/ui/GenericComponent";

const TournamentsList = async () => {
  let data_tournaments: Tournament[] = [];
 const res = await fetchServerside("/tournaments", {
  cache: "no-store",
  headers: {
    Cookie: (await cookies()).toString(),
  },
});
  if (res.ok) {
    data_tournaments = await res.json();
  }

  return (
    <div className="mt-8 sm:mt-16 w-full sm:w-fit px-8 py-12 sm:py-16 lg:px-16 border-t border-b border-stone-700/70 overflow-y-scroll">
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
        <p className="text-stone-500">
          {"There aren't any tournaments you're a part of yet."}
        </p>
      )}

      {/* show Component Gallery either tounament exist or not  */}
      <div className="mt-20 border-t border-stone-800 pt-12">
        <h3 className="text-stone-600 mb-8 text-sm uppercase tracking-widest">Component Gallery (Test View)</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1200px]">
          {/* left calum */}
          <div className="flex flex-col gap-6">
            <GenericComponent title="Attendees">
              <div className="space-y-1 text-sm">
                <p>1. Emelia Haney</p>
                <p>2. Yasin Tucker</p>
                <p>3. Earl Allison</p>
                <p>4. Emilie Whitaker</p>
                <p className="text-stone-500 mt-2">...and more</p>
              </div>
            </GenericComponent>

            <GenericComponent title="Location">
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <p className="flex-1">Softwarepark 23, Hagenberg im Mühlkreis</p>
                <div className="w-full sm:w-48 h-32 bg-stone-800 rounded-md border border-stone-700 flex items-center justify-center text-stone-600">
                  Image Placeholder
                </div>
              </div>
            </GenericComponent>
          </div>

          {/* right calum */}
          <div className="flex flex-col gap-6">
            <GenericComponent 
              title="Error 312" 
              error={{ code: 312, message: "This is the error message" }}
            />

            <GenericComponent title="Additional information">
              <p className="text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper rhoncus sodales.
              </p>
            </GenericComponent>
            
            <GenericComponent title="Coming soon">
              <div className="flex justify-center py-6">
                <span className="text-stone-600">...</span>
              </div>
            </GenericComponent>
          </div>
        </div>
      </div>
      
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
        className="relative rounded border border-stone-700 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgrounds[indexForImage % backgrounds.length]})`,
        }}
      >
        <div className="relative backdrop-blur-xs w-full h-full sm:min-h-28 sm:min-w-lg py-3 px-4 bg-black/75">
          <h2 className="sm:text-xl font-semibold font-logo">
            {tournament.full_name}
          </h2>
          <p className="text-xs sm:text-base text-stone-300 font-semibold">
            {tournament.shortened_name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export { TournamentsList };
