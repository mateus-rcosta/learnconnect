// pages/index.tsx
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { PostStats } from "@/components/PostStats";
import { useNewHomeController } from "@/hooks/useNewHomeController";

export default function NewHomePage() {
  /* ---- lógica central vinda do seu hook ------------------------ */
  const ctrl = useNewHomeController();

  /* ---- busca local (opcional) --------------------------------- */
  const [search, setSearch] = useState("");

  /* ---- render -------------------------------------------------- */
  return (
    <Layout.HomeTemplate
      /* Navegação / sidebar */
      currentRoute={ctrl.currentRoute}
      goToRoute={ctrl.goToRoute}
      /* Auth + avatar / menu */
      isLoggedIn={ctrl.isLoggedIn}
      onLoginClick={ctrl.handleLogin}
      onLogoutClick={ctrl.handleLogout}
        onSubmitLogin={ctrl.doLogin}
        onSubmitRegister={ctrl.doRegister}
      userAvatarUrl={ctrl.userAvatarUrl}
      showProfileMenu={ctrl.profileMenuOpen}
      profileMenuRef={ctrl.profileMenuRef}
      toggleProfileMenu={() =>
        ctrl.setProfileMenuOpen(!ctrl.profileMenuOpen)
      }
      /* Modais */
      activeModal={ctrl.activeModal}
      setActiveModal={ctrl.setActiveModal}
      /* Busca (Topbar.Search) */
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={() => {/* filtrar ou chamar API */}}
      /* Feed / scroll */
      feedRef={ctrl.feedRef}
      sentinelRef={ctrl.sentinelRef}
      /* Botão “Novo” na Topbar */
      onCreateClick={() => ctrl.goToRoute("create", "/create")}
    >
      {/* -------------------------------------------- */}
      {/*  Conteúdo do feed: cards                    */}
      {/* -------------------------------------------- */}
      {ctrl.allPosts.map((p) => (
        <PostCard.Root
          key={p.id}
          clickable
          onClick={() => ctrl.openPostPage(p.id)}
        >
          <PostCard.Header
            flag={Boolean(p.flag)} 
            category={p.categoria.nome}
            title={p.titulo}
            authorAvatar={p.usuario.avatar_url}
            authorUsername={p.usuario.apelido}
            createdAt={p.data_criacao}
            thumbnailUrl={p.thumbnail_url}
          />


          {/* ações (likes / comentar / compartilhar) */}
          <PostCard.Footer
            likes={ctrl.postStates[p.id]?.likes ?? 0}
            onLike={() => ctrl.handleLike(p.id)}
            onComment={() => ctrl.toggleComments(p.id)}
            onShare={() => ctrl.toggleShare(p.id)}
            showLikeWarn={ctrl.likeWarnId === p.id}
            /* se quiser animar coração preenchido */
            userHasLiked={ctrl.likeAnimations[p.id] ?? false}
          />
          {/* ➜ Se preferir usar PostStats.Root + Like/Comment/Share,
               basta trocar este Footer pelo grupo PostStats. */}
        </PostCard.Root>
      ))}
    </Layout.HomeTemplate>
  );
}
