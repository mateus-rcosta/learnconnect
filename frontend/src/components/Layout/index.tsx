// src/components/Layout/index.tsx
import { HomeTemplate } from "./HomeTemplate";
import { MaterialTemplate } from "./MaterialTemplate";
import { Spinner } from "./Spinner";
import { Message } from "./Message";
import { Modal } from "./Modal";

export const Layout = {
  HomeTemplate,
  MaterialTemplate,
  Spinner,
  Message,
  Modal,
};

export type { HomeTemplateProps } from "./HomeTemplate";
export type { MaterialTemplateProps } from "./MaterialTemplate";
export type { ModalProps } from "./Modal";
export { HomeTemplate, MaterialTemplate, Spinner, Message, Modal };
