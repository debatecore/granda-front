import Link from "next/link";
import MOW2024OlekSad from "../../../public/MOW2024-oleksad.jpg";

const TournamentDoesntExist = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center">
      <div
        className="relative m-auto max-w-5xl w-full h-4/6 bg-cover rounded border border-stone-700"
        style={{
          backgroundImage: `url(${MOW2024OlekSad.src})`,
        }}
      >
        <div className=" w-full h-full bg-black/75 flex flex-col justify-center items-center gap-4 backdrop-blur-sm p-4 z-10">
          <h2 className="font-logo text-4xl text-center text-balance z-20">
            {
              "Tournament doesn't exist or you don't have permission to view it."
            }
          </h2>
          <Link
            href={"/tournaments"}
            className="bg-stone-800 p-1 px-2 rounded border border-stone-600 hover:border-stone-400 focus:border-stone-400 z-20"
          >
            {"Back to your tournaments."}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { TournamentDoesntExist };
