import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useMaterialController } from "@/hooks/useMaterialController";
import { Layout } from "@/components/Layout";
import { Modals } from "@/components/Modals";
import { ProfileViewer } from "@/components/ProfileViewer";

/* ---------------------------------------------------------------
 * Chip de status reutilizado
 * ------------------------------------------------------------- */
const StatusChip = ({ text, icon }: { text: string; icon: string }) => (
  <span className="flex items-center gap-1 border border-[#5c64f4] px-3 py-0.5 rounded-full text-xs">
    <Image src={icon} width={12} height={12} alt="" />
    {text}
  </span>
);

/* ---------------------------------------------------------------
 * Página do material
 * ------------------------------------------------------------- */
export default function MaterialView() {
  const c = useMaterialController();
  const [showComments, setShowComments] = useState(false);

  /* --------- carregando / erro --------- */
  if (c.loadingPost) return <Layout.Spinner />;
  if (c.error || !c.post)
    return (
      <Layout.Message variant="error">Falha ao carregar material.</Layout.Message>
    );

  /* --------- layout principal ---------- */
  return (
    <>
      <Layout.MaterialTemplate
        currentRoute="material"
        goToRoute={(r, p) => c.router.push(p)}
        isLoggedIn={c.isLoggedIn}
        onLoginClick={c.handleLogin}
        onLogoutClick={c.handleLogout}
        userAvatarUrl={c.user?.avatar_url}
        showProfileMenu={c.profileMenuOpen}
        profileMenuRef={c.profileMenuRef}
        toggleProfileMenu={() => c.setProfileMenuOpen(!c.profileMenuOpen)}
        search=""
        onSearchChange={() => {}}
        onCreateClick={() => c.router.push("/create")}
        onSubmitLogin={c.doLogin}
        onSubmitRegister={c.doRegister}
      >
        {/* ---------------------- CARD ---------------------- */}
        <div
          className="mx-auto w-full max-w-4xl bg-[#050505] border border-[#5c64f4]
                     rounded-lg shadow-[0_0_15px_#5c64f4] flex flex-col"
          style={{ minHeight: "70vh" }}
        >
          {/* ----- cabeçalho ----- */}
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex gap-3 mb-2">
                <StatusChip
                  text={c.post.flag ? "Revisado/Verificado" : "Em Análise"}
                  icon={
                    c.post.flag
                      ? "/images/verificadotag.png"
                      : "/images/emanalisetag.png"
                  }
                />
                <StatusChip
                  text={c.post.categoria?.nome ?? "Sem categoria"}
                  icon="/images/segurancatag.png"
                />
              </div>

              <h1 className="text-3xl font-bold">{c.post.titulo}</h1>
              <p
                className="mt-1 text-sm text-gray-400 cursor-pointer hover:text-[#5c64f4]"
                onClick={() => c.setAuthorModal(true)}
              >
                @{c.post.usuario?.apelido} •{" "}
                {new Date(c.post.data_criacao).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {c.post.thumbnail_url && (
              <Image
                src={c.post.thumbnail_url}
                alt=""
                width={96}
                height={96}
                className="rounded object-cover"
              />
            )}
          </div>

          {/* ----- conteúdo ----- */}
          <div
            className="px-4 pb-4 flex-1 overflow-y-auto"
            style={{ scrollbarColor: "#5c64f4 #1a1a1a", maxHeight: "60vh" }}
          >
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {c.post.descricao}
            </p>
          </div>

          {/* ----- footer ----- */}
          <div className="bg-[#121212] border-t border-[#5c64f4] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              {/* like */}
              <button
                onClick={c.toggleLike}
                className={clsx(
                  "flex items-center gap-1 transition",
                  c.userHasLiked ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
                )}
              >
                <Image
                  src={
                    c.userHasLiked
                      ? "/images/curtida-preenchida.png"
                      : "/images/curtida.png"
                  }
                  width={16}
                  height={16}
                  alt=""
                />
                {c.likes}
              </button>

              {/* share */}
              <button
                onClick={c.share}
                className="flex items-center gap-1 hover:text-[#5c64f4]"
              >
                <Image
                  src="/images/compartilhar.png"
                  width={16}
                  height={16}
                  alt=""
                />
                {c.shares}
              </button>

              {/* comments */}
              <button
                onClick={() => setShowComments(!showComments)}
                className={clsx(
                  "flex items-center gap-1 transition",
                  showComments
                    ? "text-[#5c64f4] border-b-2 border-[#5c64f4]"
                    : "hover:text-[#5c64f4]"
                )}
              >
                <Image
                  src="/images/comentarios.png"
                  width={16}
                  height={16}
                  alt=""
                />
                Comentários
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------- COMMENTS ------------------ */}
        {showComments && (
          <div
            className="mt-4 mx-auto w-full max-w-4xl border rounded-lg
                       border-[#5c64f4] bg-[#1a1a1a] shadow-[0_0_15px_#5c64f4] relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => setShowComments(false)}
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-white p-4 border-b border-[#5c64f4]">
              Comentários
            </h3>

            <div className="p-4 flex flex-col max-h-[40vh]">
              {/* lista */}
              <div
                className="overflow-y-auto pr-1 mb-4 flex-1"
                style={{ scrollbarColor: "#5c64f4 #1a1a1a" }}
              >
                <div className="flex flex-col gap-4 text-sm text-gray-300">
                  {c.loadingComments && (
                    <p className="italic text-gray-400 text-center">
                      Carregando…
                    </p>
                  )}

                  {!c.loadingComments && c.comments.length === 0 && (
                    <p className="italic text-gray-500 text-center">
                      <span className="text-[#5c64f4] text-lg mr-1">💬</span>
                      Nenhum comentário ainda.
                    </p>
                  )}

                  {c.comments.map((cm) => (
                    <div key={cm.id} className="flex gap-2">
                      <img
                        src={
                          cm.usuario?.avatar_url || "/images/standard_icon.png"
                        }
                        className="w-6 h-6 rounded-full object-cover cursor-pointer mt-0.5"
                        onClick={() => c.setProfileModal(cm.usuario)}
                      />
                      <div className="flex-1">
                        <span
                          className="text-[#5c64f4] cursor-pointer"
                          onClick={() => c.setProfileModal(cm.usuario)}
                        >
                          @{cm.usuario?.apelido}
                        </span>
                        <p>{cm.conteudo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* input */}
              {c.isLoggedIn ? (
                <div className="pt-2 border-t border-[#5c64f4]">
                  <input
                    value={c.newComment}
                    onChange={(e) => c.setNewComment(e.target.value)}
                    placeholder="Comente…"
                    className="w-full bg-[#121212] text-white p-2 rounded"
                  />
                  <button
                    onClick={c.sendComment}
                    className="mt-2 bg-[#5c64f4] text-white px-4 py-2 rounded hover:bg-[#4a54e1]"
                  >
                    Enviar
                  </button>
                </div>
              ) : (
                <p className="text-sm text-red-300 mt-2">
                  Você deve estar logado para comentar!
                </p>
              )}
            </div>
          </div>
        )}
      </Layout.MaterialTemplate>

      {/* ---------------------- MODAIS GLOBAIS -------------------- */}
      <Modals.Login
        open={c.activeModal === "login"}
        onClose={() => c.setActiveModal(null)}
        onLogin={c.doLogin}
        onGoRegister={() => c.setActiveModal("register")}
        onGoReset={() => c.setActiveModal("reset")}
        
      />
      <Modals.Register
        open={c.activeModal === "register"}
        onClose={() => c.setActiveModal(null)}
        onRegister={c.doRegister}
        onGoLogin={() => c.setActiveModal("login")}
        
      />
      <Modals.ResetPassword
        open={c.activeModal === "reset"}
        onClose={() => c.setActiveModal(null)}
        onSendMail={() => c.setActiveModal(null)}
        onGoLogin={() => c.setActiveModal("login")}
      />
      <Modals.Support
        open={c.activeModal === "support"}
        onClose={() => c.setActiveModal(null)}
        onSend={() => c.setActiveModal(null)}
      />

      {/* ---------------------- PERFIL (autor / usuário) ---------- */}
      {c.profileModal && (
        <ProfileViewer
          user={c.profileModal}
          onClose={() => c.setProfileModal(null)}
        />
      )}
      {c.authorModal && c.authorData && (
        <ProfileViewer
          user={c.authorData}
          onClose={() => c.setAuthorModal(false)}
        />
      )}
    </>
  );
}
