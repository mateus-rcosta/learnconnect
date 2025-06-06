// src/components/PostCard/PostCardFooter.tsx
import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/Icon";

export interface PostCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  likes: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  showLikeWarn?: boolean;
  userHasLiked?: boolean;
}

export const PostCardFooter = React.forwardRef<
  HTMLDivElement,
  PostCardFooterProps
>(
  (
    {
      likes,
      onLike,
      onComment,
      onShare,
      showLikeWarn = false,
      userHasLiked = false,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={clsx("flex items-center gap-6 text-gray-300", className)}
      {...rest}
    >
      {/* Like */}
      <button
        onClick={onLike}
        className={clsx(
          "flex items-center gap-1 transition",
          userHasLiked ? "text-[#5c64f4]" : "hover:text-[#5c64f4]",
        )}
      >
        <Icon.Root name={userHasLiked ? "Heart" : "Heart"} size={18} />
        <span className="text-sm">{likes}</span>
        {showLikeWarn && (
          <span className="text-xs text-red-500 ml-2">
            Faça login para curtir
          </span>
        )}
      </button>

      {/* Comment */}
      <button
        onClick={onComment}
        className="flex items-center gap-1 hover:text-[#5c64f4] transition text-sm"
      >
        <Icon.Root name="MessageCircle" size={18} />
        <span>Comentar</span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="flex items-center gap-1 hover:text-[#5c64f4] transition text-sm"
      >
        <Icon.Root name="Share2" size={18} />
        <span>Compartilhar</span>
      </button>
    </div>
  ),
);

PostCardFooter.displayName = "PostCardFooter";
