// pages/discord.tsx
import React, { useState } from "react";
import { DiscordTemplate } from "@/components/Layout/DiscordTemplate";
import { useDiscordController } from "@/hooks/useDiscordController";

export default function DiscordPage() {
  const ctrl = useDiscordController();
  const [search, setSearch] = useState("");

  return (
    <DiscordTemplate
      /* navegação / sidebar */
      currentRoute={ctrl.currentRoute}
      goToRoute={ctrl.goToRoute}
      /* auth */
      isLoggedIn={ctrl.isLoggedIn}
      onLoginClick={ctrl.onLoginClick}
      onLogoutClick={ctrl.onLogoutClick}
      onSubmitLogin={ctrl.doLogin}
      onSubmitRegister={ctrl.doRegister}
      userAvatarUrl={ctrl.userAvatarUrl}
      showProfileMenu={ctrl.profileMenuOpen}
      profileMenuRef={ctrl.profileMenuRef}
      toggleProfileMenu={() => ctrl.setProfileMenuOpen(!ctrl.profileMenuOpen)}
      /* modais */
      activeModal={ctrl.activeModal}
      setActiveModal={ctrl.setActiveModal}
      /* busca */
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={() => {}}
      /* botão Novo (não será exibido para visitante) */
      onCreateClick={() => ctrl.goToRoute("create", "/create")}
    >
      {/** ------------- CONTEÚDO ESTÁTICO ---------------- */ }
      <div
        className="relative w-full h-40 sm:h-60 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/servidorbanner.png')" }}
      />
      <div className="relative -mt-10 flex justify-center">
        <img
          src="/images/servidordc.png"
          alt="Ícone do Servidor"
          className="w-24 h-24 rounded-full border-4 border-[#121212] object-cover"
        />
      </div>

      <section className="text-center mt-4 px-4">
        <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
          Old&nbsp;Duque&apos;s
          <img src="/images/dccomunidadeicon.png" alt="" className="w-5 h-5" />
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          <span>207&nbsp;Membros</span> •{" "}
          <span className="text-green-400">55&nbsp;Online</span>
        </p>
        <p className="mt-1 text-sm text-gray-400">Est. Ago&nbsp;2020</p>

        <p className="text-sm text-gray-300 mt-3 w-full sm:w-3/4 md:w-1/2 mx-auto leading-relaxed">
          Um lugar dedicado… Nosso próprio servidor no Discord. <br />
          Encontre colegas de aprendizado e caminhada, ou ensine os&nbsp;outros!{" "}
          <br />
          Networking é nosso sobrenome aqui. Com requinte, você é bem-vindo(a)!
        </p>

        <div className="mt-4">
          <a
            href="https://discord.gg/wDMfTdkF79"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#5c64f4] text-white px-6 py-2 text-lg font-semibold rounded-full
                       transition hover:bg-white hover:text-[#5c64f4]
                       hover:shadow-[0_0_10px_#5c64f4]"
          >
            Ir para o servidor
          </a>
        </div>
      </section>
    </DiscordTemplate>
  );
}
