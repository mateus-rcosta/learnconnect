// src/components/Layout/HomeTemplate.tsx
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Feed, FeedRef } from "@/components/Feed";
import { Modals } from "@/components/Modals";

export interface HomeTemplateProps {
  /** Navegação / estado de rota — já existente */
  currentRoute: string;
  goToRoute: (route: string, path: string) => void;

  /** Autenticação */
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  
  /** Submissão de formulários */ 
  onSubmitLogin: (email: string, pwd: string) => void; 
  onSubmitRegister: ( 
    name: string,
    nickname: string, 
    email: string, 
    pwd: string,
    birth?: string, 
  ) => void;

  /** Avatar & menu de perfil */
  userAvatarUrl?: string | null;
  showProfileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleProfileMenu: () => void;

  /** Modais */
  activeModal: "login" | "register" | "reset" | "support" | null;
  setActiveModal: (
    m: HomeTemplateProps["activeModal"],
  ) => void;

  /** Busca */
  search: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;

  /** Feed (scroll infinito) */
  feedRef?: FeedRef;
  sentinelRef?: React.RefObject<HTMLDivElement>;

  /** Post creation button → route /create */
  onCreateClick: () => void;

  /** Cards / children inseridos externamente */
  children: React.ReactNode;
}

/**
 * Estrutura principal da NewHome.
 * Sidebar (esq) • Topbar (topo) • Feed (scroll) + Modais.
 */
export const HomeTemplate: React.FC<HomeTemplateProps> = ({
  /** props ↓ */
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

  feedRef,
  sentinelRef,
  onCreateClick,

  children,
}) => (
  <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
    {/* Sidebar */}
    <Sidebar.Root currentRoute={currentRoute} goToRoute={goToRoute}>

       {/* Logo LearnConnect */} 
       <div className="-mt-3 mb-6 flex items-center gap-2 px-2"> 
         <img 
           src="/images/logotipo.png" 
           alt="LearnConnect" 
           className="w-7 h-7" 
          /> 
        <span className="text-lg font-bold text-[#5c64f4]"> 
         LearnConnect 
        </span> 
       </div>

      <Sidebar.Item
        route="home"
        path="/"
        imgSrc="/images/home.png"
        label="Início"
      />
      <Sidebar.Item
        route="popular"
        path="/popular"
        imgSrc="/images/popular.png"
        label="Popular"
      />
      <Sidebar.Item
        route="explore"
        path="/explore"
        imgSrc="/images/explore.png"
        label="Explore"
        
      />
      <Sidebar.Item
        route="discord"
        path="/discord"
        imgSrc="/images/comunidades.png"
        label="Discord"
        
      />
      <Sidebar.Item
        route="topics"
        path="/topics"
        imgSrc="/images/topicos.png"
        label="Tópicos"
        
      />
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
    </Sidebar.Root>

    {/* Coluna principal */}
    <div className="flex-1 flex flex-col">
      {/* Topbar */}
      <Topbar.Root>

        <Topbar.Search
          query={search}
          onQueryChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />
         
                {/* usuário NÃO logado → botão Entrar */} 
        {!isLoggedIn && ( 
          <button 
            className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90" 
           onClick={() => setActiveModal("login")} 
          > 
           Entrar 
          </button> 
        )} 
 
        {/* usuário logado → botão Novo + avatar/menu */} 
        {isLoggedIn && ( 
         <> 
            <Topbar.ButtonCreate onClick={onCreateClick} /> 
            <Topbar.ProfileMenu 
              isLoggedIn 
              avatarUrl={userAvatarUrl || undefined} 
              open={showProfileMenu} 
              containerRef={profileMenuRef} 
              toggle={toggleProfileMenu} 
              onLogin={() => setActiveModal("login")} 
             onLogout={onLogoutClick} 
            /> 
          </> 
        )}
        
      </Topbar.Root>

      {/* Feed */}
      <Feed.Root feedRef={feedRef} sentinelRef={sentinelRef}>
        {children}
        </Feed.Root>
    </div>

    {/* Modais globais */}
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
      onRegister={onSubmitRegister} // handle outside
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
