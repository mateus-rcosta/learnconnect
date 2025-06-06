// src/components/PostStats/PostShare.tsx
import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/Icon";

export interface PostShareProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PostShare = React.forwardRef<
  HTMLButtonElement,
  PostShareProps
>(({ className, ...rest }, ref) => (
  <button
    ref={ref}
    className={clsx(
      "flex items-center gap-1 hover:text-[#5c64f4] transition text-sm",
      className,
    )}
    {...rest}
  >
    <Icon.Root name="Share2" size={18} />
    <span>Compartilhar</span>
  </button>
));

PostShare.displayName = "PostShare";
