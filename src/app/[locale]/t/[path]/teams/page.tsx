export default async function TournamentTeamsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Teams`}</h1>
      </div>
    </>
  );
}
