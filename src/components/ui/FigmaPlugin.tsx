type FigmaPluginProps = {
  text?: string;
};

export function FigmaPlugin({ text }: FigmaPluginProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      {" "}
      {/* this is just a wrapper for centering */}
      <div
        className="w-[270px] h-[54px] py-5 bg-[#2c2c2c] rounded outline outline-[0.50px] outline-offset-[-0.50px] outline-[#979797]/80
      inline-flex justify-center items-center gap-2.5"
      >
        {" "}
        {/* button rectangle */}
        <div className="opacity-75 text-center justify-center text-white/75 text-xl font-medium">
          {" "}
          {text}{" "}
        </div>{" "}
        {/* the text */}
      </div>
    </div>
  );
}
