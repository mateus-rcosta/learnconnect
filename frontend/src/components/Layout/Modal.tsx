// Modal.tsx
import React, { ReactNode } from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean          // ← obrigatório
  onClose: () => void
  children: ReactNode
  className?: string
}

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ open, onClose, children, className }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative bg-[#1a1a1a] rounded-xl shadow-[0_0_10px_#5c64f4] p-6 w-[90%] max-w-md animate-[fadeInScale_0.25s]",
          className
        )}
      >
        <button
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
