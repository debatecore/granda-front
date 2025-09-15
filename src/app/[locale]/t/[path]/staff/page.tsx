export default async function TournamentStaffPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Staff, Judges & Bias`}</h1>
      </div>
    </>
  );
}
