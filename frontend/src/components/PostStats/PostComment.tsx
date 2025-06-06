// src/components/PostStats/PostComment.tsx
import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/Icon";

export interface PostCommentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Total de comentários (opcional para exibir badge) */
  count?: number;
}

export const PostComment = React.forwardRef<
  HTMLButtonElement,
  PostCommentProps
>(({ count, className, ...rest }, ref) => (
  <button
    ref={ref}
    className={clsx(
      "flex items-center gap-1 hover:text-[#5c64f4] transition text-sm",
      className,
    )}
    {...rest}
  >
    <Icon.Root name="MessageCircle" size={18} />
    <span>Comentar</span>
    {typeof count === "number" && (
      <span className="ml-1 text-xs text-gray-400">({count})</span>
    )}
  </button>
));

PostComment.displayName = "PostComment";
