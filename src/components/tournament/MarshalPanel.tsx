type MarshalPanelProps = {
  motion: string;
};

export function MarshalPanel({ motion }: MarshalPanelProps) {
  const conductDebateHref = `https://tools.debateco.re/oxford-debate/setup?motion=${encodeURIComponent(
    motion,
  )}`;

  return (
    <div className="mt-8 w-full border border-stone-700 bg-stone-900/60 p-4 sm:mt-10">
      <div className="mb-3 flex justify-end">
        <h2 className="text-sm font-medium text-stone-300">Marshal buttons</h2>
      </div>

      <a
        href={conductDebateHref}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-sm border border-stone-600 bg-white/10 px-6 py-5 text-center text-xl font-semibold text-white transition hover:bg-white/15"
      >
        Conduct debate!
      </a>
    </div>
  );
}
