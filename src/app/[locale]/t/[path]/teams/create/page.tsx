export default async function TeamCreationView({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4 flex gap-6 items-center">
        <h1 className="text-2xl font-logo">{`Team creation`}</h1>
        <form>
          <label htmlFor="full_name">Name</label>
          <input
            name="full_name"
            type="text"
            className="bg-black border-2 border-stone-700/70"
          ></input>
          <label htmlFor="shortened_name">Shortened name</label>
          <input
            name="shortened_name"
            type="text"
            className="bg-black border-2 border-stone-700/70"
          ></input>
          <button>Save</button>
        </form>
      </div>
    </>
  );
}
