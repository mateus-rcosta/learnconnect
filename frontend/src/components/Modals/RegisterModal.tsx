//src/components/RegisterModal.tsx
import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (
    name: string, 
    nickname: string, 
    email: string, 
    password: string, 
    birth?: string,  
  ) => void;
  onGoLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
  onRegister,
  onGoLogin,
}) => {
  const [name , setName ] = useState("");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [birth, setBirth] = useState(""); 

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-[90%] max-w-md bg-[#1a1a1a] p-6 rounded-xl border border-[#5c64f4]/40 animate-[fadeInScale_0.25s]">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2 mb-4">
          <Icon.Root name="UserPlus" />
          Criar conta
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRegister(
              nick.trim(), 
              nick.trim().toLowerCase(),
              email.trim(), 
              pwd,
              birth || undefined,
            );
          }}
          className="space-y-4"
        >

          <Input.Root 
           placeholder="Nome completo" 
           value={name} 
           onChange={(e) => setName(e.target.value)} 
          />
          <Input.Root
            placeholder="Apelido (@nickname)"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <Input.Root
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Root 
           type="date" 
           placeholder="Data de nascimento" 
           value={birth} 
           onChange={(e) => setBirth(e.target.value)} 
         />
          <Input.Root
            type="password"
            placeholder="Senha"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button.Root variant="primary" size="md" className="w-full">
            <Button.Text>Registrar</Button.Text>
          </Button.Root>
        </form>

        <p className="mt-4 text-sm text-[#5c64f4]">
          Já tem conta?{" "}
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
