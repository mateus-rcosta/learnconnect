import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar  } from "@/components/Topbar";

export interface CreateTemplateProps {
  currentRoute: string;
  goToRoute  : (r: string, p: string) => void;

  /* auth */
  isLoggedIn       : boolean;
  onLoginClick     : () => void;
  onLogoutClick    : () => void;
  userAvatarUrl?   : string;
  showProfileMenu  : boolean;
  profileMenuRef   : React.RefObject<HTMLDivElement | null>;   // ← aceita null
  toggleProfileMenu: () => void;

  /* botão “novo” (obrigatório pelo Topbar.ButtonCreate) */
  onCreateClick: () => void;

  children: React.ReactNode;
}

export const CreateTemplate: React.FC<CreateTemplateProps> = ({
  currentRoute,
  goToRoute,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  userAvatarUrl,
  showProfileMenu,
  profileMenuRef,
  toggleProfileMenu,
  onCreateClick,
  children,
}) => (
  <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
    {/* -------- Sidebar -------- */}
    <Sidebar.Root currentRoute={currentRoute} goToRoute={goToRoute}>
      <div className="-mt-3 mb-6 flex items-center gap-2 px-2">
        <img src="/images/logotipo.png" className="w-7 h-7" />
        <span className="text-lg font-bold text-[#5c64f4]">LearnConnect</span>
      </div>

      <Sidebar.Item route="home"    path="/"         imgSrc="/images/home.png"        label="Início"   />
      <Sidebar.Item route="popular" path="/popular"  imgSrc="/images/popular.png"     label="Popular"  />
      <Sidebar.Item route="explore" path="/explore"  imgSrc="/images/explore.png"     label="Explore"  />
      <Sidebar.Item route="discord" path="/discord"  imgSrc="/images/comunidades.png" label="Discord"  />
      <Sidebar.Item route="topics"  path="/topics"   imgSrc="/images/topicos.png"     label="Tópicos"  />
      <Sidebar.Item route="create"  path="/create"   imgSrc="/images/criar.png"       label="Criar"    />
    </Sidebar.Root>

    {/* -------- Coluna principal -------- */}
    <div className="flex-1 flex flex-col">
      <Topbar.Root>
        <Topbar.Search query="" onQueryChange={() => {}} onSubmit={() => {}} />

        {!isLoggedIn && (
          <button
            className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
            onClick={onLoginClick}
          >
            Entrar
          </button>
        )}

        {isLoggedIn && (
          <>
            {/* Botão Criar (obrigatório no componente) */}
            <Topbar.ButtonCreate onClick={onCreateClick} />

            <Topbar.ProfileMenu
              isLoggedIn
              avatarUrl={userAvatarUrl}
              containerRef={profileMenuRef}
              open={showProfileMenu}
              toggle={toggleProfileMenu}
              onLogin={onLoginClick}
              onLogout={onLogoutClick}
            />
          </>
        )}
      </Topbar.Root>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
);
