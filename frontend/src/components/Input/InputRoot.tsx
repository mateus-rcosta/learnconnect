// src/components/Input/InputRoot.tsx
import React from "react";
import clsx from "clsx";

export type InputSize = "sm" | "md" | "lg";

export interface InputRootProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tamanho do campo (altura / fonte / padding) */
  size?: InputSize;
  /** Mostra borda em vermelho se true  */
  isInvalid?: boolean;
  /** Ícone à esquerda (ex.: <Icon.Root name="Search" />) */
  leftIcon?: React.ReactNode;
  /** Ícone à direita (ex.: botão de limpar) */
  rightIcon?: React.ReactNode;
}

/** Mapa Tailwind para tamanhos */
const SIZE: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-4 text-lg",
};

/**
 * Campo de entrada unificado para todo o projeto.
 *
 * ```tsx
 * <Input.Root
 *   placeholder="Search…"
 *   leftIcon={<Icon.Root name="Search" size={16} className="text-white/60" />}
 * />
 * ```
 */
export const InputRoot = React.forwardRef<HTMLInputElement, InputRootProps>(
  (
    {
      size = "md",
      isInvalid = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        className={clsx(
          "relative flex items-center rounded-2xl bg-[#1a1a1a] transition-colors",
          isInvalid
            ? "border border-red-500 focus-within:ring-red-500"
            : "border border-[#5c64f4]/40 focus-within:ring-[#5c64f4]",
          disabled && "opacity-60 cursor-not-allowed",
          className,
        )}
      >
        {leftIcon && (
          <span className="pl-3 flex items-center text-white/60">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={clsx(
            "peer w-full bg-transparent text-white placeholder-white/40 focus:outline-none",
            SIZE[size],
            leftIcon && "pl-2",
            rightIcon && "pr-2",
          )}
          {...rest}
        />

        {rightIcon && (
          <span className="pr-3 flex items-center text-white/60">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

InputRoot.displayName = "InputRoot";
