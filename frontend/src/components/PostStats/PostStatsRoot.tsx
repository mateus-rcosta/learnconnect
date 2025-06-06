// src/components/PostStats/PostStatsRoot.tsx
import React from "react";
import clsx from "clsx";

export interface PostStatsRootProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Contêiner flex onde vivem Like / Comment / Share.
 */
export const PostStatsRoot = React.forwardRef<
  HTMLDivElement,
  PostStatsRootProps
>(({ className, children, ...rest }, ref) => (
  <div
    ref={ref}
    className={clsx("flex items-center gap-6 text-gray-300", className)}
    {...rest}
  >
    {children}
  </div>
));

PostStatsRoot.displayName = "PostStatsRoot";
