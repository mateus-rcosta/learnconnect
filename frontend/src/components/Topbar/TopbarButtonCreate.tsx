// src/components/Topbar/TopbarButtonCreate.tsx
import React from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export interface TopbarButtonCreateProps {
  /** Rota/path para criação de material */
  onClick: () => void;
}

export const TopbarButtonCreate: React.FC<TopbarButtonCreateProps> = ({
  onClick,
}) => (
  <Button.Root
    variant="primary"
    size="sm"
    onClick={onClick}
    className="hidden sm:inline-flex"
  >
    <Button.Icon>
      <Icon.Root name="Plus" size={18} />
    </Button.Icon>
    <Button.Text>Novo</Button.Text>
  </Button.Root>
);
