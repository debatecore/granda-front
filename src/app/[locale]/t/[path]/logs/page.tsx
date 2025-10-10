export default async function TournamentLogsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Audit Log`}</h1>
      </div>
    </>
  );
}
