//src/components/Layout/MaterialTemplate.tsx
import { Sidebar }     from "@/components/Sidebar";
import { Topbar }      from "@/components/Topbar";
import clsx            from "clsx";
import { ReactNode, RefObject } from "react";

/*  ~~  Barra lateral e topo são reescritos aqui mesmo  ~~  */

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <a
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={clsx(
      "flex items-center gap-2 cursor-pointer transition",
      active ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
    )}
  >
    <img src={icon} alt={label} className="w-5 h-5" />
    <span>{label}</span>
  </a>
);

export interface MaterialTemplateProps {
  /* navegação */
  currentRoute: string;
  goToRoute: (route: string, path: string) => void;

  /* auth */
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;

  /* avatar / menu */
  userAvatarUrl?: string | null;
  showProfileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleProfileMenu: () => void;

  /* pesquisa */
  search: string;
  onSearchChange: (v: string) => void;

  /* “+ Novo” */
  onCreateClick: () => void;

  /* conteúdo */
  children: React.ReactNode;
  className?: string;
}

export const MaterialTemplate: React.FC<MaterialTemplateProps> = ({
  currentRoute,
  goToRoute,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  userAvatarUrl,
  showProfileMenu,
  profileMenuRef,
  toggleProfileMenu,
  search,
  onSearchChange,
  onCreateClick,
  children,
  className,
}) => (
  <div className="bg-[#121212] text-white min-h-screen flex">
    {/* ---------------------------------------------------------------- */}
    {/*  SIDEBAR                                                         */}
    {/* ---------------------------------------------------------------- */}
    <aside className="hidden sm:flex flex-col w-60 bg-[#1a1a1a] p-4">
      <div className="flex items-center mb-8">
        <img src="/images/logotipo.png" alt="" className="w-8 h-8 mr-2" />
        <span className="text-xl font-bold text-[#5c64f4]">LearnConnect</span>
      </div>

      <nav className="flex flex-col gap-4">
        {[
          { r: "home",     p: "/",         icon: "/images/home.png",        label: "Home" },
          { r: "popular",  p: "/popular",  icon: "/images/popular.png",     label: "Popular" },
          { r: "explore",  p: "/explore",  icon: "/images/explore.png",     label: "Explore" },
          { r: "discord",  p: "/discord",  icon: "/images/comunidades.png", label: "Discord" },
          { r: "topics",   p: "/topics",   icon: "/images/topicos.png",     label: "Tópicos" },
        ].map((i) => (
          <NavItem
            key={i.r}
            icon={i.icon}
            label={i.label}
            active={currentRoute === i.r}
            onClick={() => goToRoute(i.r, i.p)}
          />
        ))}

        <a
          href="https://cai0duque.github.io/website-duque/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-[#5c64f4]"
        >
          <img src="/images/conheca-nos.png" className="w-5 h-5" />
          Conheça-nos
        </a>
      </nav>
    </aside>

    {/* ---------------------------------------------------------------- */}
    {/*  COLUNA PRINCIPAL                                                */}
    {/* ---------------------------------------------------------------- */}
    <div className="flex-1 flex flex-col">
      {/* ---------------- TOPBAR ---------------- */}
      <header className="flex items-center justify-between bg-[#1a1a1a] p-3 sm:p-4">
        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full bg-[#121212] text-white px-4 py-2 pl-10 focus:outline-none"
            />
            <img
              src="/images/search.png"
              alt=""
              className="absolute w-5 h-5 top-2.5 left-3"
            />
          </div>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 bg-[#1a1a1a] border border-[#5c64f4] rounded-full px-4 py-2 hover:bg-[#2a2a2a]"
              onClick={onCreateClick}
            >
              <img src="/images/criar.png" className="w-5 h-5" />
              Criar
            </button>

            <button className="relative">
              <img src="/images/notificacoes.png" className="w-6 h-6" />
            </button>

            <div className="relative" ref={profileMenuRef}>
              <img
                src={userAvatarUrl || "/images/standard_icon.png"}
                className="w-8 h-8 rounded-full cursor-pointer object-cover"
                onClick={toggleProfileMenu}
              />
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-[0_0_10px_#5c64f4]">
                  <ul className="py-2 text-sm">
                    <li
                      className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex gap-2"
                      onClick={() => onLogoutClick()}
                    >
                      <img src="/images/Config.png" className="w-4 h-4" />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
            onClick={onLoginClick}
          >
            Entrar
          </button>
        )}
      </header>

      {/* ---------------- CONTEÚDO ---------------- */}
      <main className={clsx("flex-1 p-4 md:p-6 overflow-y-auto", className)}>
        {children}
      </main>
    </div>
  </div>
);
