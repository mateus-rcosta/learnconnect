// src/components/Button/ButtonIcon.tsx
import React from "react";
import clsx from "clsx";

export interface ButtonIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Define posição do ícone */
  position?: "left" | "right";
}

export const ButtonIcon = React.forwardRef<
  HTMLSpanElement,
  ButtonIconProps
>(({ position = "left", className, children, ...rest }, ref) => (
  <span
    ref={ref}
    className={clsx(
      "flex items-center",
      position === "left" ? "-ml-1" : "-mr-1",
      className,
    )}
    {...rest}
  >
    {children}
  </span>
));

ButtonIcon.displayName = "ButtonIcon";
