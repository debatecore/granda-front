export default async function TournamentLocationsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Physical Infrastructure`}</h1>
      </div>
    </>
  );
}
