// src/components/PostStats/index.tsx
import { PostStatsRoot } from "./PostStatsRoot";
import { PostLike } from "./PostLike";
import { PostComment } from "./PostComment";
import { PostShare } from "./PostShare";

export const PostStats = {
  Root: PostStatsRoot,
  Like: PostLike,
  Comment: PostComment,
  Share: PostShare,
};

export type { PostStatsRootProps } from "./PostStatsRoot";
export type { PostLikeProps } from "./PostLike";
export type { PostCommentProps } from "./PostComment";
export type { PostShareProps } from "./PostShare";
