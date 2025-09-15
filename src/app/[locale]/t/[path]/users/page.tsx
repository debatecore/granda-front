export default async function TournamentUsersPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{`Users`}</h1>
      </div>
    </>
  );
}
