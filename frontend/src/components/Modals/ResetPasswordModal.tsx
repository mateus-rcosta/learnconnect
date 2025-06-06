import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSendMail: (email: string) => void;
  onGoLogin: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  onSendMail,
  onGoLogin,
}) => {
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-[90%] max-w-md bg-[#1a1a1a] p-6 rounded-xl border border-[#5c64f4]/40 animate-[fadeInScale_0.25s]">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2 mb-4">
          <Icon.Root name="Mail" />
          Recuperar senha
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMail(email.trim());
          }}
          className="space-y-4"
        >
          <Input.Root
            type="email"
            placeholder="E-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button.Root variant="primary" size="md" className="w-full">
            <Button.Text>Enviar link</Button.Text>
          </Button.Root>
        </form>

        <p className="mt-4 text-sm text-[#5c64f4]">
          Lembrou a senha?{" "}
          <button onClick={onGoLogin} className="hover:underline">
            Entrar
          </button>
        </p>

        <button
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <Icon.Root name="X" size={20} />
        </button>
      </div>
    </div>
  );
};
