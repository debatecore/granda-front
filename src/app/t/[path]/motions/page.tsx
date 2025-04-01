export default async function TournamentMotionsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Motions`}</h1>
      </div>
    </>
  );
}
