import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar }  from "@/components/Topbar";

export interface SettingsTemplateProps {
  /* navegação */
  currentRoute: string;
  goToRoute: (r: string, p: string) => void;

  /* auth + avatar */
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  userAvatarUrl?: string;
  showProfileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleProfileMenu: () => void;

  /* busca (opcional) */
  search?: string;
  onSearchChange?: (v: string) => void;
  onCreateClick?: () => void;

  children: React.ReactNode;
}

/* ——————————————————————————————————————— */
export const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  currentRoute,
  goToRoute,

  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  userAvatarUrl,
  showProfileMenu,
  profileMenuRef,
  toggleProfileMenu,

  search = "",
  onSearchChange = () => {},
  onCreateClick = () => {},

  children,
}) => (
  <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
    {/* -------- Sidebar global -------- */}
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
      <Sidebar.Item
        route="about"
        path="https://cai0duque.github.io/website-duque/"
        imgSrc="/images/conheca-nos.png"
        label="Conheça-nos"
        onClick={() =>
          window.open(
            "https://cai0duque.github.io/website-duque/",
            "_blank",
            "noopener,noreferrer",
          )
        }
      />
      {/* item “settings” destacado */}
      <Sidebar.Item
        route="settings"
        path="/settings"
        imgSrc="/images/Config.png"
        label="Configurações"
      />
    </Sidebar.Root>

    {/* -------- Coluna principal -------- */}
    <div className="flex-1 flex flex-col">
      {/* Topbar global */}
      <Topbar.Root>
        <Topbar.Search
          query={search}
          onQueryChange={onSearchChange}
          onSubmit={() => {}}
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
              avatarUrl={userAvatarUrl}
              open={showProfileMenu}
              containerRef={profileMenuRef}
              toggle={toggleProfileMenu}
              onLogin={onLoginClick}
              onLogout={onLogoutClick}
            />
          </>
        )}
      </Topbar.Root>

      {/* Área de conteúdo */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
);
