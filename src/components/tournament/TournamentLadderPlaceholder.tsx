type TournamentLadderPlaceholderProps = {
  title: string;
  description: string;
};

export function TournamentLadderPlaceholder({
  title,
  description,
}: TournamentLadderPlaceholderProps) {
  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-stone-400 sm:text-base">{description}</p>
      </div>
    </div>
  );
}