// src/components/PostCard/PostCardRoot.tsx
import React from "react";
import clsx from "clsx";

export interface PostCardRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Se `true`, mostra cursor pointer no hover */
  clickable?: boolean;
}

export const PostCardRoot = React.forwardRef<
  HTMLDivElement,
  PostCardRootProps
>(({ clickable = false, className, children, ...rest }, ref) => (
  <article
    ref={ref}
    className={clsx(
      "bg-[#1a1a1a] rounded-lg p-4 border border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_#5c64f4] hover:border-[#5c64f4] flex flex-col gap-3",
      clickable && "cursor-pointer",
      className,
    )}
    {...rest}
  >
    {children}
  </article>
));

PostCardRoot.displayName = "PostCardRoot";
