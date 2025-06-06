// src/components/PostCard/PostCardBody.tsx
import React from "react";
import clsx from "clsx";

export interface PostCardBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PostCardBody = React.forwardRef<
  HTMLDivElement,
  PostCardBodyProps
>(({ className, children, ...rest }, ref) => (
  <div ref={ref} className={clsx("text-sm text-gray-300", className)} {...rest}>
    {children}
  </div>
));

PostCardBody.displayName = "PostCardBody";
