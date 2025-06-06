// src/components/Button/ButtonText.tsx
import React from "react";
import clsx from "clsx";

export interface ButtonTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Sub-componente apenas para o texto do botão.
 * Herdará o `gap` definido no ButtonRoot.
 */
export const ButtonText = React.forwardRef<
  HTMLSpanElement,
  ButtonTextProps
>(({ className, ...rest }, ref) => (
  <span ref={ref} className={clsx("select-none", className)} {...rest} />
));

ButtonText.displayName = "ButtonText";
