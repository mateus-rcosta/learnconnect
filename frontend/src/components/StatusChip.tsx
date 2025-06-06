// src/components/StatusChip.tsx
import Image from "next/image";
import clsx from "clsx";

export interface StatusChipProps {
  status: "analysis" | "verified";
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  className,
}) => {
  const cfg =
    status === "analysis"
      ? {
          label: "Em Análise",
          icon: "/images/emanalisetag.png",
          border: "border-[#5c64f4]",
        }
      : {
          label: "Revisado/Verificado",
          icon: "/images/verificadotag.png",
          border: "border-[#2ecc71]", 
        };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
        "bg-transparent",            
        "text-white",
        "shadow-none",
        "select-none",
        "whitespace-nowrap",
        "transition-colors",
        "hover:opacity-90",
        "border",  //stroke
        cfg.border,
        className,
      )}
    >
      <Image src={cfg.icon} alt="" width={14} height={14} />
      {cfg.label}
    </span>
  );
};
