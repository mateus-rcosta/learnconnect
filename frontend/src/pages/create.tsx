/* ------------------------------------------------------------------ */
/*  Página /create – ajustada                                          */
/* ------------------------------------------------------------------ */
import { Layout }              from "@/components/Layout";
import { CreateTemplate }      from "@/components/Layout/CreateTemplate";
import { useCreateController } from "@/hooks/useCreateController";
import { Modals }              from "@/components/Modals";
import clsx                    from "clsx";
import toast                   from "react-hot-toast";   // ← import faltante

export default function CreatePage() {
  const c = useCreateController();

  if (!c.isLoggedIn && c.activeModal !== "login") {
    return <Layout.Spinner />;
  }

  const filteredTags = c.cats.filter((t) =>
    t.nome.toLowerCase().includes(c.tagQuery.toLowerCase()),
  );

  return (
    <>
      <CreateTemplate
        currentRoute={c.currentRoute}
        goToRoute={c.goToRoute}
        isLoggedIn={c.isLoggedIn}
        onLoginClick={c.onLoginClick}
        onLogoutClick={c.onLogoutClick}
        userAvatarUrl={c.userAvatarUrl}
        showProfileMenu={c.profileMenuOpen}
        profileMenuRef={c.profileMenuRef}
        toggleProfileMenu={c.toggleProfileMenu}
        onCreateClick={() => { /* já estamos na tela create */ }}
      >
        {/* ---------- cabeçalho local ---------- */}
        <h1 className="text-2xl font-bold mb-6">Create post</h1>

        {/* ---------- tabs ---------- */}
        <nav className="flex gap-6 mb-6 border-b border-gray-700">
          {(["text", "images"] as const).map((t) => (
            <button
              key={t}
              className={clsx(
                "pb-2",
                c.tab === t
                  ? "text-white border-b-2 border-[#5c64f4]"
                  : "text-gray-400",
              )}
              onClick={() => c.setTab(t)}
            >
              {t === "text" ? "Texto" : "Imagens"}
            </button>
          ))}
        </nav>

        {/* ---------- form ---------- */}
        {/* título */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Título<span className="text-red-400">*</span>
          </label>
          <input
            className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded text-white"
            maxLength={300}
            value={c.title}
            onChange={(e) => c.setTitle(e.target.value)}
          />
          <div className="text-right text-xs text-gray-400">
            {c.title.length}/300
          </div>
        </div>

        {/* tag obrigatória */}
        <div className="mb-4 relative">
          <button
            className="bg-[#2a2a2a] hover:bg-[#333] text-sm py-1 px-3 rounded"
            onClick={() => c.setTagSelector(!c.tagSelector)}
          >
            {c.tag ? `Tag: ${c.tag}` : "Adicionar Tag"}
          </button>

          {c.tagSelector && (
            <div className="absolute top-12 left-0 w-64 bg-[#1a1a1a] border border-gray-600 p-4 rounded shadow-lg z-10">
              <input
                className="w-full bg-[#121212] p-2 rounded mb-3 text-white"
                placeholder="Pesquisar tag…"
                value={c.tagQuery}
                onChange={(e) => c.setTagQuery(e.target.value)}
              />
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                {filteredTags.map((t) => (
                  <button
                    key={t.nome}
                    className="bg-[#2a2a2a] hover:bg-[#333] text-left text-sm px-3 py-1 rounded"
                    onClick={() => c.selectTag(t.nome)}
                  >
                    {t.nome}
                  </button>
                ))}
                {filteredTags.length === 0 && (
                  <p className="text-xs text-gray-500">Nenhuma tag encontrada</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* conteúdo dinamico */}
        {c.tab === "text" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Conteúdo</label>
            <textarea
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded text-white h-32"
              value={c.body}
              onChange={(e) => c.setBody(e.target.value)}
            />
          </div>
        )}

        {c.tab === "images" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">
              URL da imagem
            </label>
            <input
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded text-white"
              placeholder="https://…"
              value={c.thumb}
              onChange={(e) => c.setThumb(e.target.value)}
            />
            {c.thumb && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-1">Preview:</p>
                <img
                  src={c.thumb}
                  className="max-h-48 rounded border border-gray-600"
                  alt="preview"
                />
              </div>
            )}
          </div>
        )}

        {/* botões */}
        <button
          className={clsx(
            "bg-[#5c64f4] text-white px-6 py-2 rounded hover:opacity-90 flex items-center gap-2",
            { "opacity-60 pointer-events-none": c.posting },
          )}
          onClick={c.postMaterial}
        >
          {c.posting && (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
          )}
          {c.posting ? "Enviando…" : "Postar"}
        </button>
      </CreateTemplate>

      {/* ────── Modais de auth ────── */}
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
        onSendMail={() => toast.success("E-mail enviado!")}
        onGoLogin={() => c.setActiveModal("login")}
      />
      <Modals.Support
        open={c.activeModal === "support"}
        onClose={() => c.setActiveModal(null)}
        onSend={() => toast.success("Mensagem enviada!")}
      />
    </>
  );
}
