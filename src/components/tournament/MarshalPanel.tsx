type MarshalPanelProps = {
  title: string;
  buttonLabel: string;
  href: string;
};

export function MarshalPanel({
  title,
  buttonLabel,
  href,
}: MarshalPanelProps) {
  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:py-16 lg:px-16">
      <div className="flex flex-col gap-6">
        <h2 className="text-right text-2xl font-semibold text-white">{title}</h2>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="block rounded-md border border-stone-600 bg-white/10 px-6 py-6 text-center text-2xl font-semibold text-white transition hover:bg-white/15"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}