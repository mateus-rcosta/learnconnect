import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar }  from "@/components/Topbar";

export interface MaterialTemplateProps {
  /* navegação */
  currentRoute: string;
  goToRoute: (route: string, path: string) => void;

  /* auth */
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSubmitLogin: (email: string, pwd: string) => void;
  onSubmitRegister: (
    name: string,
    nick: string,
    email: string,
    pwd: string,
    birth?: string
  ) => void;

  /* avatar / menu */
  userAvatarUrl?: string | null;
  showProfileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleProfileMenu: () => void;

  /* busca (opcional) */
  search: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;

  /* botão +Novo */
  onCreateClick: () => void;

  /* children = conteúdo da página */
  children: React.ReactNode;
  className?: string;
}

export const MaterialTemplate: React.FC<MaterialTemplateProps> = ({
  currentRoute,
  goToRoute,

  /* auth */
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onSubmitLogin,
  onSubmitRegister,

  userAvatarUrl,
  showProfileMenu,
  profileMenuRef,
  toggleProfileMenu,

  search,
  onSearchChange,
  onSearchSubmit,

  onCreateClick,

  children,
  className,
}) => (
  <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
    {/* ---------- SIDEBAR (reutilizado) ---------- */}
    <Sidebar.Root currentRoute={currentRoute} goToRoute={goToRoute}>
      {/* logo */}
      <div className="-mt-3 mb-6 flex items-center gap-2 px-2">
        <img src="/images/logotipo.png" className="w-7 h-7" />
        <span className="text-lg font-bold text-[#5c64f4]">LearnConnect</span>
      </div>

      <Sidebar.Item route="home"    path="/"         imgSrc="/images/home.png"        label="Início"   />
      <Sidebar.Item route="popular" path="/popular"  imgSrc="/images/popular.png"     label="Popular"  />
      <Sidebar.Item route="explore" path="/explore"  imgSrc="/images/explore.png"     label="Explore"  />
      <Sidebar.Item route="discord" path="/discord"  imgSrc="/images/comunidades.png" label="Discord"  />
      <Sidebar.Item route="topics"  path="/topics"   imgSrc="/images/topicos.png"     label="Tópicos"  />
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

    {/* ---------- COLUNA PRINCIPAL ---------- */}
    <div className="flex-1 flex flex-col">
      {/* ---- TOPBAR ---- */}
      <Topbar.Root>
        <Topbar.Search
          query={search}
          onQueryChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />

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

      {/* ---- CONTEÚDO ---- */}
      <main className={`flex-1 p-4 md:p-6 overflow-y-auto ${className || ""}`}>
        {children}
      </main>
    </div>
  </div>
);
