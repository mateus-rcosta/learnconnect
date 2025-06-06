// src/components/Button/ButtonRoot.tsx
import React from "react";
import clsx from "clsx";

/** Tamanhos permitidos */
const SIZE = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
} as const;
export type ButtonSize = keyof typeof SIZE;

/** Variantes de estilo */
const VARIANT = {
  primary:
    "bg-[#5c64f4] text-white hover:bg-[#4a52e0] active:bg-[#4048d4] disabled:bg-[#5c64f4]/60",
  secondary:
    "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] active:bg-[#333] disabled:bg-[#1a1a1a]/60",
  ghost:
    "bg-transparent text-white hover:bg-white/10 active:bg-white/20 disabled:text-white/40",
} as const;
export type ButtonVariant = keyof typeof VARIANT;

export interface ButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Se `true`, mostra cursor `wait` e bloqueia clique  */
  isLoading?: boolean;
}

/**
 * Botão raiz – recebe icon/text como children.
 *
 * ```tsx
 * <Button.Root variant="primary" size="md" onClick={…}>
 *   <Button.Icon><Icon name="plus" /></Button.Icon>
 *   <Button.Text>Novo</Button.Text>
 * </Button.Root>
 * ```
 */
export const ButtonRoot = React.forwardRef<
  HTMLButtonElement,
  ButtonRootProps
>(
  (
    {
      size = "md",
      variant = "primary",
      isLoading = false,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-1 rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c64f4]",
        SIZE[size],
        VARIANT[variant],
        isLoading && "cursor-wait",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {children}
    </button>
  ),
);

ButtonRoot.displayName = "ButtonRoot";
