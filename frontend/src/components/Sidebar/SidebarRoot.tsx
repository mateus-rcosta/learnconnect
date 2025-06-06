// src/components/Sidebar/SidebarRoot.tsx
import React, { createContext, useContext } from "react";
import clsx from "clsx";

interface ISidebarContext {
  currentRoute: string;
  goToRoute: (route: string, path: string) => void;
}

const SidebarContext = createContext<ISidebarContext | null>(null);
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar.Item deve estar dentro de Sidebar.Root");
  return ctx;
};

export interface SidebarRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ISidebarContext {}

/**
 * Contêiner vertical da Sidebar.
 * Fornece contexto para os itens definirem estado de 'ativo'.
 */
export const SidebarRoot: React.FC<SidebarRootProps> = ({
  currentRoute,
  goToRoute,
  className,
  children,
  ...rest
}) => (
  <SidebarContext.Provider value={{ currentRoute, goToRoute }}>
    <aside
      className={clsx(
        "bg-[#121212] border-r border-gray-800 flex flex-col py-8 px-3 w-20 sm:w-56 gap-4",
        className,
      )}
      {...rest}
    >
      {children}
    </aside>
  </SidebarContext.Provider>
);
