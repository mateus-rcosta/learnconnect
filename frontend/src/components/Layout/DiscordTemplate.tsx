// src/components/Layout/DiscordTemplate.tsx
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Modals } from "@/components/Modals";

/** Mesmo contrato básico do HomeTemplate, só sem props de Feed */
export interface DiscordTemplateProps {
  currentRoute: string;
  goToRoute: (route: string, path: string) => void;

  /* Auth */
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSubmitLogin: (email: string, pwd: string) => void;
  onSubmitRegister: (
    name: string,
    nickname: string,
    email: string,
    pwd: string,
    birth?: string
  ) => void;

  /* Avatar & menu */
  userAvatarUrl?: string | null;
  showProfileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleProfileMenu: () => void;

  /* Modais */
  activeModal: "login" | "register" | "reset" | "support" | null;
  setActiveModal: (m: DiscordTemplateProps["activeModal"]) => void;

  /* Busca */
  search: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;

  /* Botão Novo */
  onCreateClick: () => void;

  /* Conteúdo estático / children */
  children: React.ReactNode;
}

/** Estrutura para páginas fixas (Discord, About etc.) */
export const DiscordTemplate: React.FC<DiscordTemplateProps> = ({
  currentRoute,
  goToRoute,

  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onSubmitLogin,
  onSubmitRegister,

  userAvatarUrl,
  showProfileMenu,
  profileMenuRef,
  toggleProfileMenu,

  activeModal,
  setActiveModal,

  search,
  onSearchChange,
  onSearchSubmit,

  onCreateClick,
  children,
}) => (
  <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
    {/* ---- Sidebar ------------------------------------------------ */}
    <Sidebar.Root currentRoute={currentRoute} goToRoute={goToRoute}>
      <div className="-mt-3 mb-6 flex items-center gap-2 px-2">
        <img
          src="/images/logotipo.png"
          alt="LearnConnect"
          className="w-7 h-7"
        />
        <span className="text-lg font-bold text-[#5c64f4]">LearnConnect</span>
      </div>

      <Sidebar.Item route="home" path="/" imgSrc="/images/home.png" label="Início" />
      <Sidebar.Item route="popular" path="/popular" imgSrc="/images/popular.png" label="Popular" />
      <Sidebar.Item route="explore" path="/explore" imgSrc="/images/explore.png" label="Explore" />
      <Sidebar.Item route="discord" path="/discord" imgSrc="/images/comunidades.png" label="Discord" />
      <Sidebar.Item route="topics" path="/topics" imgSrc="/images/topicos.png" label="Tópicos" />
      <Sidebar.Item
        route="about"
        path="https://cai0duque.github.io/website-duque/"
        imgSrc="/images/conheca-nos.png"
        label="Conheça-nos"
        onClick={() =>
          window.open(
            "https://cai0duque.github.io/website-duque/",
            "_blank",
            "noopener,noreferrer"
          )
        }
      />
    </Sidebar.Root>

    {/* ---- Coluna Principal -------------------------------------- */}
    <div className="flex-1 flex flex-col">
      {/* Topbar */}
      <Topbar.Root>
        <Topbar.Search
          query={search}
          onQueryChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />

        {!isLoggedIn && (
          <button
            className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
            onClick={() => setActiveModal("login")}
          >
            Entrar
          </button>
        )}

        {isLoggedIn && (
          <>
            <Topbar.ButtonCreate onClick={onCreateClick} />
            <Topbar.ProfileMenu
              isLoggedIn
              avatarUrl={userAvatarUrl || undefined}
              open={showProfileMenu}
              containerRef={profileMenuRef}
              toggle={toggleProfileMenu}
              onLogin={onLoginClick}
              onLogout={onLogoutClick}
            />
          </>
        )}
      </Topbar.Root>

      {/* Conteúdo da página (rolagem própria) */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>

    {/* ---- Modais Globais ---------------------------------------- */}
    <Modals.Login
      open={activeModal === "login"}
      onClose={() => setActiveModal(null)}
      onLogin={onSubmitLogin}
      onGoRegister={() => setActiveModal("register")}
      onGoReset={() => setActiveModal("reset")}
    />

    <Modals.Register
      open={activeModal === "register"}
      onClose={() => setActiveModal(null)}
      onRegister={onSubmitRegister}
      onGoLogin={() => setActiveModal("login")}
    />

    <Modals.ResetPassword
      open={activeModal === "reset"}
      onClose={() => setActiveModal(null)}
      onSendMail={() => setActiveModal(null)}
      onGoLogin={() => setActiveModal("login")}
    />

    <Modals.Support
      open={activeModal === "support"}
      onClose={() => setActiveModal(null)}
      onSend={() => setActiveModal(null)}
    />
  </div>
);
