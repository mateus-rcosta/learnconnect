//src/components/LoginModal.tsx
import React, { useState } from "react";
import clsx from "clsx";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onGoRegister: () => void;
  onGoReset: () => void;
}



export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onLogin,
  onGoRegister,
  onGoReset,
}) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      aria-modal
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={clsx(
          "relative z-10 w-96 max-w-[90%] rounded-xl bg-[#1a1a1a] p-6 border border-[#5c64f4]/40 shadow-2xl",
          "animate-[fadeInScale_0.25s_ease-out]",
        )}
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <Icon.Root name="LogIn" />
          Entrar
        </h2>

        <p className="text-sm text-gray-400 mb-4">
         Ao continuar, você concorda com nosso Contrato de Usuário e
         reconhece que compreende nossa
         Política de Privacidade. 
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(email.trim(), pwd);
          }}
          className="space-y-4"
        >
          <Input.Root
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input.Root
            type="password"
            placeholder="Senha"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />

          <Button.Root variant="primary" size="md" className="w-full">
            <Button.Text>Entrar</Button.Text>
          </Button.Root>
        </form>

        {/* Links */}
        <div className="mt-4 flex flex-col text-sm text-[#5c64f4] gap-2">
          <button onClick={onGoReset} className="hover:underline">
            Esqueci minha senha
          </button>
          <button onClick={onGoRegister} className="hover:underline">
            Não tem conta? Registrar-se
          </button>
        </div>

        

        {/* Close btn */}
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
