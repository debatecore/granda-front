import { getTranslations } from "next-intl/server";

export default async function TournamentRootPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const t = await getTranslations("overview");
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Fictional content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Fictitious content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Made-up content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Filler content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Nonexistent content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Visual-only content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Overflowing content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Scrollable content!</p>
            <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
}
