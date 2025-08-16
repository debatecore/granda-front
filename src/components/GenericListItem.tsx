import Link from "next/link";
import { JSX } from "react";

const GenericListItem = ({
  title,
  subtitle,
  href,
  icon,
  indexForImage,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  icon?: () => JSX.Element;
  indexForImage: number;
}) => {
  return (
    <>
      <div className="relative rounded sm:min-w-3xs lg:w-xl border border-stone-700 bg-cover bg-center overflow-hidden">
        <Link href={href || ""}>
          <div className="relative backdrop-blur-xs w-full h-full sm:min-h-14 sm:min-w-lg py-3 px-4 bg-black/75">
            <h2 className="sm:text-xl font-semibold font-logo">{title}</h2>
            <p className="text-xs sm:text-base text-stone-300 font-semibold">
              {subtitle}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

export { GenericListItem };
