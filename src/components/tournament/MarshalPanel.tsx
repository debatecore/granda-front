import { GenericComponent } from "@/components/ui/GenericComponent";

type MarshalPanelProps = {
  motion: string;
};

export function MarshalPanel({ motion }: MarshalPanelProps) {
  const conductDebateHref = `https://tools.debateco.re/oxford-debate/setup?motion=${encodeURIComponent(
    motion,
  )}`;

  return (
    <GenericComponent
      title="Marshal panel"
      showActions
      className="mt-8 w-full max-w-[760px] sm:mt-10"
    >
      <a
        href={conductDebateHref}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-sm border border-stone-600 bg-white/10 px-6 py-5 text-center text-xl font-semibold text-white transition hover:bg-white/15"
      >
        Conduct debate!
      </a>
    </GenericComponent>
  );
}
