// src/components/Topbar/TopbarRoot.tsx
import React from "react";
import clsx from "clsx";

export interface TopbarRootProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TopbarRoot = React.forwardRef<
  HTMLDivElement,
  TopbarRootProps
>(({ className, children, ...rest }, ref) => (
  <header
    ref={ref}
    className={clsx(
      "w-full h-16 flex items-center gap-4 px-4 border-b border-gray-800 bg-[#121212] sticky top-0 z-20",
      className,
    )}
    {...rest}
  >
    {children}
  </header>
));

TopbarRoot.displayName = "TopbarRoot";
