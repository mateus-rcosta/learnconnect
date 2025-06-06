// src/components/Sidebar/SidebarItem.tsx
import React from "react";
import clsx from "clsx";
import { Icon, LucideIconName } from "@/components/Icon";
import { useSidebar } from "./SidebarRoot";

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rótulo lógico usado em `currentRoute` */
  route: string;
  /** Caminho para navegação (é passado para `goToRoute`) */
  path: string;
  /** Ícone da lib Lucide (opcional se você usar imgSrc) */ 
  icon?: LucideIconName; 
  /** Caminho de imagem customizada em /public (png/svg) */ 
  imgSrc?: string;
  /** Texto visível (opcional em telas estreitas) */
  label: string;
}

export const SidebarItem = React.forwardRef<
  HTMLButtonElement,
  SidebarItemProps
>(({ route, path, icon, imgSrc, label, className, ...rest }, ref) => {
  const { currentRoute, goToRoute } = useSidebar();
  const isActive = currentRoute === route;

  return (
    <button
      ref={ref}
      onClick={() => goToRoute(route, path)}
      className={clsx(
        "group flex items-center gap-3 w-full py-2 px-2 rounded-lg transition-colors",
        isActive
          ? "bg-[#5c64f4]/20 text-[#5c64f4]"
          : "hover:bg-white/10 text-gray-300",
        className,
      )}
      {...rest}
    >
            {imgSrc ? ( 
        <img src={imgSrc} alt="" className="w-5 h-5" /> 
      ) : ( 
        <Icon.Root 
          name={icon as LucideIconName} 
          size={22} 
          className={clsx(isActive && "text-[#5c64f4]")} 
        /> 
      )}

      {/* Esconde o texto quando a largura é estreita (≤640 px) */}
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </button>
  );
});

SidebarItem.displayName = "SidebarItem";
