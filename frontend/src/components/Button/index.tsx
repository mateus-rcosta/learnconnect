// src/components/Button/index.tsx
import { ButtonRoot } from "./ButtonRoot";
import { ButtonText } from "./ButtonText";
import { ButtonIcon } from "./ButtonIcon";

export const Button = {
  Root: ButtonRoot,
  Text: ButtonText,
  Icon: ButtonIcon,
};

export type {
  ButtonRootProps,
  ButtonSize,
  ButtonVariant,
} from "./ButtonRoot";
