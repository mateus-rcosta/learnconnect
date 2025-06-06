// src/components/PostStats/PostLike.tsx
import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/Icon";

export interface PostLikeProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Total de likes */
  count: number;
  /** Se o usuário atual curtiu */
  hasLiked?: boolean;
  /** Se `true`, mostra aviso de login necessário */
  warnNoAuth?: boolean;
}

export const PostLike = React.forwardRef<
  HTMLButtonElement,
  PostLikeProps
>(
  (
    { count, hasLiked = false, warnNoAuth = false, className, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      className={clsx(
        "flex items-center gap-1 transition",
        hasLiked ? "text-[#5c64f4]" : "hover:text-[#5c64f4]",
        className,
      )}
      {...rest}
    >
      <Icon.Root
        name={hasLiked ? "Heart" : "Heart"}
        size={18}
        className={clsx(
          "transition-transform",
          hasLiked && "scale-110 animate-pulse",
        )}
      />
      <span className="text-sm">{count}</span>
      {warnNoAuth && (
        <span className="text-xs text-red-500 ml-2">
          Faça login para curtir
        </span>
      )}
    </button>
  ),
);

PostLike.displayName = "PostLike";
