// src/components/Topbar/index.tsx
import { TopbarRoot } from "./TopbarRoot";
import { TopbarSearch } from "./TopbarSearch";
import { TopbarButtonCreate } from "./TopbarButtonCreate";
import { TopbarProfileMenu } from "./TopbarProfileMenu";

export const Topbar = {
  Root: TopbarRoot,
  Search: TopbarSearch,
  ButtonCreate: TopbarButtonCreate,
  ProfileMenu: TopbarProfileMenu,
};

export type { TopbarRootProps } from "./TopbarRoot";
export type { TopbarSearchProps } from "./TopbarSearch";
export type { TopbarButtonCreateProps } from "./TopbarButtonCreate";
export type { TopbarProfileMenuProps } from "./TopbarProfileMenu";
