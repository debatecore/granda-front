import { DebatesList } from "@/components/tournament/DebatesList";
import { getTranslations } from "next-intl/server";

type DebatesPageProps = {
  params: Promise<{
    locale: string;
    path: string;
  }>;
};

export default async function DebatesPage({ params }: DebatesPageProps) {
  const { path } = await params;
  const t = await getTranslations("debates");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-full flex-col px-8 sm:mt-16 lg:px-16">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
          {t("title")}
        </h1>

        <div className="mt-8 w-full">
          <DebatesList tournamentId={path} />
        </div>
      </div>
    </div>
  );
}
