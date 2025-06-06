// src/components/Topbar/TopbarSearch.tsx
import React from "react";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";

export interface TopbarSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
}

export const TopbarSearch: React.FC<TopbarSearchProps> = ({
  query,
  onQueryChange,
  onSubmit,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }}
    className="flex-1"
  >
    <Input.Root
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Buscar materiais..."
      size="sm"
      leftIcon={<Icon.Root name="Search" size={16} />}
    />
  </form>
);
