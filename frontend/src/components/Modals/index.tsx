import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { SupportModal } from "./SupportModal";

export const Modals = {
  Login: LoginModal,
  Register: RegisterModal,
  ResetPassword: ResetPasswordModal,
  Support: SupportModal,
};

export type { LoginModalProps } from "./LoginModal";
export type { RegisterModalProps } from "./RegisterModal";
export type { ResetPasswordModalProps } from "./ResetPasswordModal";
export type { SupportModalProps } from "./SupportModal";
