import React from "react";
import * as LucideIcons from "lucide-react";
import clsx from "clsx";

/** Todos os nomes válidos do pacote lucide-react. */
export type LucideIconName = keyof typeof LucideIcons;

export interface IconRootProps extends React.SVGProps<SVGSVGElement> {
  /** Nome do ícone exportado por lucide-react */
  name: LucideIconName;
  /** Tamanho (px ou rem) – padrão 20 px */
  size?: number | string;
  /** Stroke width – padrão 2 px */
  strokeWidth?: number;
  /** Fallback caso o nome não exista – padrão Circle */
  fallbackName?: LucideIconName;
}

/** Wrapper genérico para todos os ícones lucide-react */
export const IconRoot = React.forwardRef<SVGSVGElement, IconRootProps>(
  (
    {
      name,
      size = 20,
      strokeWidth = 2,
      fallbackName = "Circle",
      className,
      ...rest
    },
    ref,
  ) => {
    /* 1. converte exportações para Record<string,Component> */
    const icons =
      LucideIcons as unknown as Record<string, React.ComponentType<any>>;

    /* 2. escolhe ícone ou fallback */
    const LucideComponent =
      icons[name] ?? icons[fallbackName] ?? icons.Circle;

    /* 3. renderiza */
    return (
      <LucideComponent
        ref={ref}
        size={size}
        strokeWidth={strokeWidth}
        className={clsx("flex-shrink-0", className)}
        {...rest}
      />
    );
  },
);

IconRoot.displayName = "IconRoot";
