// src/components/PostCard/index.tsx
import { PostCardRoot } from "./PostCardRoot";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardBody } from "./PostCardBody";
import { PostCardFooter } from "./PostCardFooter";

export const PostCard = {
  Root: PostCardRoot,
  Header: PostCardHeader,
  Body: PostCardBody,
  Footer: PostCardFooter,
};

export type { PostCardRootProps } from "./PostCardRoot";
export type { PostCardHeaderProps } from "./PostCardHeader";
export type { PostCardBodyProps } from "./PostCardBody";
export type { PostCardFooterProps } from "./PostCardFooter";
