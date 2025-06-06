// src/components/Topbar/TopbarProfileMenu.tsx
import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/Icon";
import Link from "next/link";

export interface TopbarProfileMenuProps {
  /** usuário já autenticado?  */
  isLoggedIn: boolean;
  /** URL do avatar (já vem do hook) */
  avatarUrl?: string;
  /** menu aberto/fechado */
  open: boolean;
  /** ref externo para detecção de clique-fora */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** alterna open/close */
  toggle: () => void;

  /** callback para abrir modal de login (quando não logado) */
  onLogin: () => void;
  /** callback para logout */
  onLogout: () => void;
}

export const TopbarProfileMenu: React.FC<TopbarProfileMenuProps> = ({
  isLoggedIn,
  avatarUrl = "/images/standard_icon.png",
  open,
  containerRef,
  toggle,
  onLogin,
  onLogout,
}) => {
  /* se NÃO logado, mostramos botão “Entrar” simples ------------------ */
  if (!isLoggedIn) {
    return (
      <button
        className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
        onClick={onLogin}
      >
        Entrar
      </button>
    );
  }

  /* logado → avatar + dropdown -------------------------------------- */
  return (
    <div className="relative" ref={containerRef}>
      {/* avatar */}
      <img
        src={avatarUrl}
        alt="Perfil"
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={toggle}
      />

      {/* menu dropdown */}
      {open && (
        <ul
  className={clsx(
    "absolute right-0 mt-2 w-48 bg-[#1a1a1a]",
    "border border-[#5c64f4]/40 rounded-lg shadow-[0_0_10px_#5c64f4]",
    "py-2 text-sm animate-[fadeIn_0.15s_ease-out]",
  )}
>
  {/* Minhas postagens */}
  <li>
    <Link
      href="/myposts"
      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10"
    >
      <img src="/images/myposts.png" alt="" className="w-4 h-4" />
      Minhas postagens
    </Link>
  </li>

  {/* Configurações */}
  <li>
    <Link
      href="/settings"
      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10"
    >
      <img src="/images/Config.png" alt="" className="w-4 h-4" />
      Configurações
    </Link>
  </li>

  {/* Sair */}
  <li>
    <button
      onClick={onLogout}
      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-white/10 text-red-400"
    >
      <img src="/images/logoff.png" alt="" className="w-4 h-4" />
      Sair
    </button>
  </li>
</ul>
      )}
    </div>
  );
};

TopbarProfileMenu.displayName = "TopbarProfileMenu";
