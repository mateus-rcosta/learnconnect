import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  open,
  onClose,
  onSend,
}) => {
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-[95%] max-w-lg bg-[#1a1a1a] p-6 rounded-xl border border-[#5c64f4]/40 animate-[fadeInScale_0.25s]">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2 mb-4">
          <Icon.Root name="HelpCircle" />
          Suporte
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(subject.trim(), msg.trim());
          }}
          className="space-y-4"
        >
          <Input.Root
            placeholder="Assunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Descreva seu problema ou dúvida..."
            className="w-full h-32 resize-none rounded-2xl bg-[#121212] p-4 text-white border border-[#5c64f4]/40 focus:outline-none focus:ring-2 focus:ring-[#5c64f4]"
          />

          <Button.Root variant="primary" size="md" className="w-full">
            <Button.Text>Enviar</Button.Text>
          </Button.Root>
        </form>

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
