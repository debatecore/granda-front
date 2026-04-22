import { useTranslations } from "next-intl";
import { JSX, PropsWithChildren } from "react";


type GenericComponentProps = {
  title: string;
  className?: string;
  showActions?: boolean;
  error?: {
    code: number;
    message: string;
  };
};

const GenericComponent = ({
  title,
  className,
  showActions = false,
  error,
  children
}: PropsWithChildren<GenericComponentProps>) => {
  const t = useTranslations("common");

  return (
    <div className={`border ${error ? 'border-[#B15FE8]' : 'border-stone-700'} bg-stone-900/45 rounded-lg p-6 min-h-[100px] ${className}`}>
      <div className="flex justify-between items-center mb-6">
        {showActions &&(
          <div className="text-stone-500 cursor-pointer hover:text-white">•••</div>
        )}
      
        <div className="font-['Inter'] font-medium text-[20px] leading-none tracking-normal text-white/60 text-right ml-auto">
          {error ? `Error ${error.code}` : title}
        </div>
      </div>

      {error ? (
        <div 
          className="border border-[#B15FE8] bg-[#B15FE8]/10 p-10 rounded-md"
          style={{
            backgroundColor: 'rgba(177, 95, 232, 0.1)', // #B15FE8 の 10% 透過背景
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(177, 95, 232, 0.1),
                rgba(177, 95, 232, 0.1) 1px,
                transparent 1px,
                transparent 4px
              )
            ` // 45度の角度で 1px の紫色の線を引いてメッシュを再現
          }}
        >
          <div className="text-stone-300 text-lg leading-relaxed">
            <p className = "mb-4">
              {t("error_loading_content")}
            </p>
            <p className="italic">
              {t("error_message", { message: error.message})} 
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-stone-700/80 bg-black/10 p-6 rounded-md text-stone-300 text-lg">
          {children}
        </div>
      )}
    </div>
  )
};

export { GenericComponent };
export type { GenericComponentProps };