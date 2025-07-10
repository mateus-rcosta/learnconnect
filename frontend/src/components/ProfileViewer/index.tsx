// src/components/ProfileViewer/index.tsx
import React from "react";

interface Usuario {
  id?: string;
  nome?: string;        // display-name
  apelido?: string;     // @username
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
}

export function ProfileViewer({
  user,
  onClose,
}: {
  user: Usuario | null;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    /* ------------------------------------------------------------------
     *  Camada de fundo — clicar fora do cartão fecha a visualização
     * ----------------------------------------------------------------- */
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* ----------------------------------------------------------------
       *  Cartão do perfil — impede que o clique interno propague
       * ---------------------------------------------------------------- */}
      <div
        className="relative w-96 bg-[#1a1a1a] rounded-xl overflow-hidden
                   shadow-[0_0_15px_#5c64f4] ring-1 ring-[#5c64f4]/40
                   hover:ring-[#5c64f4]/80 transition duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --------------------------------------------------------------
         *  Botão fechar (✕) — gradiente vermelho-laranja + glow
         * ------------------------------------------------------------ */}
        <button
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 text-2xl
                     bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent
                     drop-shadow-[0_0_6px_rgba(255,120,64,0.9)]
                     hover:scale-110 transition-transform"
        >
          ✕
        </button>

        {/* --------------------------------------------------------------
         *  Banner
         * ------------------------------------------------------------ */}
        <div className="relative w-full h-36">
          <img
            src={user.banner_url || "/images/standard_banner.png"}
            alt="Banner do perfil"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/standard_banner.png";
            }}
          />

          {/* avatar sobreposto */}
          <img
            src={user.avatar_url || "/images/standard_icon.png"}
            alt="Avatar"
            className="absolute bottom-[-30px] left-4 w-16 h-16 rounded-full
                       border-4 border-[#121212] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/standard_icon.png";
            }}
          />
        </div>

        {/* --------------------------------------------------------------
         *  Corpo do cartão
         * ------------------------------------------------------------ */}
        <div className="pt-10 pb-4 px-4">
          <h3 className="text-lg font-bold">{user.nome || "Usuário"}</h3>

          <p className="text-sm text-gray-400">
            @{user.apelido || "username"}
          </p>

          {user.bio && (
            <p className="text-sm text-gray-400 italic mt-2">
              &quot;{user.bio}&quot;
            </p>
          )}

          {/* placeholder para futuras insígnias */}
          <div className="mt-4">
            <button
              className="text-xs bg-[#2e2e2e] text-gray-300 px-3 py-1 rounded
                         border border-[#5c64f4] hover:shadow-[0_0_5px_#5c64f4]
                         transition"
            >
              🛡️ Futuras Insígnias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
