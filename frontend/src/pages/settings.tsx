/* ------------------------------------------------------------------ */
/*  /pages/settings.tsx — versão autocontida                          */
/* ------------------------------------------------------------------ */
import { useState } from "react";
import clsx                 from "clsx";
import { Layout }           from "@/components/Layout";
import { SettingsTemplate } from "@/components/Layout/SettingsTemplate";
import { useSettingsController } from "@/hooks/useSettingsController";

/* ═══════════════════════════════════════════════════════════════════
 *  1.  Modal genérico reutilizável
 * ═══════════════════════════════════════════════════════════════════ */
function ModalShell({
  title,
  children,
  onClose,
  className,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={clsx(
          "bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]",
          className,
        )}
      >
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  2.  Modais de campo simples (input ou textarea)
 * ═══════════════════════════════════════════════════════════════════ */
type SaveFn = (v: string) => void;

const makeInputModal = (title: string, isTextarea = false) =>
  ({ current, onSave, onClose }: { current: string; onSave: SaveFn; onClose: () => void }) => {
    const [value, setValue] = useState(current);
    const Field = isTextarea ? "textarea" : "input";
    return (
      <ModalShell title={title} onClose={onClose} className={isTextarea ? "w-96" : undefined}>
        <Field
          {...(isTextarea
            ? { className: "w-full h-24 resize-none bg-[#121212] text-white p-2 rounded mb-4" }
            : { className: "w-full bg-[#121212] text-white p-2 rounded mb-4" })}
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="bg-[#5c64f4] px-4 py-2 rounded"
            onClick={() => {
              onSave(value.trim());
              onClose();
            }}
          >
            Salvar
          </button>
        </div>
      </ModalShell>
    );
  };

const DisplayNameModal = makeInputModal("Nome de exibição");
const ApelidoModal     = makeInputModal("Apelido (usuário)");
const BioModal         = makeInputModal("Descrição", /*isTextarea=*/true);
const EmailModal       = makeInputModal("Atualizar e-mail");

/* ═══════════════════════════════════════════════════════════════════
 *  3.  Modais de avatar, banner, gênero
 * ═══════════════════════════════════════════════════════════════════ */
function AvatarModal({ current, onSave, onClose }: { current: string; onSave: SaveFn; onClose: () => void }) {
  const [url, setUrl] = useState(current);
  return (
    <ModalShell title="Imagem de avatar" onClose={onClose}>
      <input
        className="w-full bg-[#121212] text-white p-2 rounded mb-2"
        placeholder="Cole a URL da imagem…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {url && (
        <div className="flex justify-center mb-4">
          <img
            src={url}
            className="w-24 h-24 rounded-full border border-gray-600 object-cover"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/images/standard_icon.png")
            }
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="bg-[#5c64f4] px-4 py-2 rounded"
          onClick={() => {
            onSave(url.trim());
            onClose();
          }}
        >
          Salvar
        </button>
      </div>
    </ModalShell>
  );
}

function BannerModal({ current, onSave, onClose }: { current: string; onSave: SaveFn; onClose: () => void }) {
  const [url, setUrl] = useState(current);
  return (
    <ModalShell title="Imagem de banner" onClose={onClose} className="w-96">
      <input
        className="w-full bg-[#121212] text-white p-2 rounded mb-2"
        placeholder="Cole a URL da imagem…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {url && (
        <div className="flex justify-center mb-4">
          <img
            src={url}
            className="w-full max-h-40 object-cover border border-gray-600 rounded"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/images/standard_banner.png")
            }
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="bg-[#5c64f4] px-4 py-2 rounded"
          onClick={() => {
            onSave(url.trim());
            onClose();
          }}
        >
          Salvar
        </button>
      </div>
    </ModalShell>
  );
}

function GeneroModal({ current, onSave, onClose }: { current: string; onSave: SaveFn; onClose: () => void }) {
  const [gen, setGen] = useState(current);
  return (
    <ModalShell title="Selecionar gênero" onClose={onClose}>
      <select
        className="w-full bg-[#121212] text-white p-2 rounded mb-4"
        value={gen}
        onChange={(e) => setGen(e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
        <option value="Prefiro não dizer">Prefiro não dizer</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="bg-[#5c64f4] px-4 py-2 rounded"
          onClick={() => {
            onSave(gen);
            onClose();
          }}
        >
          Salvar
        </button>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  4.  Modais de segurança
 * ═══════════════════════════════════════════════════════════════════ */
function PasswordModal({
  state,
  setState,
  onSave,
  onClose,
}: {
  state: { current: string; new: string; confirm: string };
  setState: (s: { current: string; new: string; confirm: string }) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Trocar senha" onClose={onClose} className="w-96">
      {(["current", "new", "confirm"] as const).map((field, i) => (
        <input
          key={field}
          type="password"
          placeholder={
            i === 0 ? "Senha atual" : i === 1 ? "Nova senha" : "Repita a nova senha"
          }
          className="w-full bg-[#121212] text-white p-2 rounded mb-2"
          value={state[field]}
          onChange={(e) => setState({ ...state, [field]: e.target.value })}
        />
      ))}

      <div className="flex gap-2 justify-end">
        <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </button>
        <button className="bg-[#5c64f4] px-4 py-2 rounded" onClick={onSave}>
          Salvar
        </button>
      </div>
    </ModalShell>
  );
}

function DeleteModal({
  pwd,
  setPwd,
  onDelete,
  onClose,
}: {
  pwd: string;
  setPwd: (v: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Excluir conta" onClose={onClose}>
      <p className="text-sm text-gray-400 mb-4">
        Digite sua senha para confirmar. Esta ação é irreversível.
      </p>
      <input
        type="password"
        className="w-full bg-[#121212] text-white p-2 rounded mb-4"
        placeholder="Senha"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button className="bg-gray-600 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </button>
        <button className="bg-red-600 px-4 py-2 rounded" onClick={onDelete}>
          Excluir
        </button>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  5.  Abas internas (Conta / Perfil)
 * ═══════════════════════════════════════════════════════════════════ */
function AccountTab({
  user,
  openPasswordModal,
  openDeleteModal,
  openEmailModal,
  openGeneroModal,
}: {
  user: any;
  openPasswordModal: () => void;
  openDeleteModal: () => void;
  openEmailModal: () => void;
  openGeneroModal: () => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Configurações</h2>

      {/* Geral */}
      <section className="mb-6">
        <h3 className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
          Geral
        </h3>
        <div className="ml-4 text-sm text-gray-400 space-y-2">
          <p>
            <strong>E-mail</strong>: {user.email || "Não informado"}{" "}
            <button onClick={openEmailModal} className="text-[#5c64f4] ml-2 hover:underline">
              &gt;
            </button>
          </p>
          <p>
            <strong>Gênero</strong>: {user.genero || "Não informado"}{" "}
            <button onClick={openGeneroModal} className="text-[#5c64f4] ml-2 hover:underline">
              &gt;
            </button>
          </p>
        </div>
      </section>

      {/* Segurança */}
      <section className="mb-6">
        <h3 className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
          Segurança
        </h3>
        <button onClick={openPasswordModal} className="ml-4 text-sm text-[#5c64f4] hover:underline">
          Trocar senha
        </button>
      </section>

      {/* Avançado */}
      <section>
        <h3 className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
          Avançado
        </h3>
        <button onClick={openDeleteModal} className="ml-4 text-sm text-[#5c64f4] hover:underline">
          Excluir conta
        </button>
      </section>
    </div>
  );
}

function ProfileTab({
  user,
  openDisplayModal,
  openBioModal,
  openAvatarModal,
  openBannerModal,
  openApelidoModal,
}: {
  user: any;
  openDisplayModal: () => void;
  openBioModal: () => void;
  openAvatarModal: () => void;
  openBannerModal: () => void;
  openApelidoModal: () => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Configurações</h2>

      <div className="w-full flex flex-col lg:flex-row gap-10">
        {/* Links à esquerda */}
        <div className="flex-1">
          <h3 className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
            Geral
          </h3>
          <div className="ml-4 text-sm text-gray-400 space-y-2">
            <p>
              <strong>Nome de exibição</strong>{" "}
              <button onClick={openDisplayModal} className="text-[#5c64f4] ml-2 hover:underline">
                &gt;
              </button>
            </p>
            <p>
              <strong>Apelido (usuário)</strong>{" "}
              <button onClick={openApelidoModal} className="text-[#5c64f4] ml-2 hover:underline">
                &gt;
              </button>
            </p>
            <p>
              <strong>Descrição</strong>{" "}
              <button onClick={openBioModal} className="text-[#5c64f4] ml-2 hover:underline">
                &gt;
              </button>
            </p>
            <p>
              <strong>Avatar</strong>{" "}
              <button onClick={openAvatarModal} className="text-[#5c64f4] ml-2 hover:underline">
                &gt;
              </button>
            </p>
            <p>
              <strong>Banner</strong>{" "}
              <button onClick={openBannerModal} className="text-[#5c64f4] ml-2 hover:underline">
                &gt;
              </button>
            </p>
          </div>
        </div>

        {/* Preview do perfil */}
        <div className="w-full lg:w-96">
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_15px_#5c64f4] ring-1 ring-[#5c64f4]/40">
            <div className="relative w-full h-36">
              <img
                src={user.banner_url || "/images/standard_banner.png"}
                className="w-full h-full object-cover"
              />
              <img
                src={user.avatar_url || "/images/standard_icon.png"}
                className="absolute bottom-[-30px] left-4 w-16 h-16 rounded-full border-4 border-[#121212] object-cover"
              />
            </div>
            <div className="pt-10 pb-4 px-4">
              <h3 className="text-lg font-bold">{user.nome || "Usuário"}</h3>
              <p className="text-sm text-gray-400">@{user.apelido}</p>
              <p className="text-sm text-gray-400 italic mt-2">
                "{user.bio || "Sem descrição"}"
              </p>

              <button className="mt-4 text-xs bg-[#2e2e2e] text-gray-300 px-3 py-1 rounded border border-[#5c64f4]">
                🛡️ Futuras Insígnias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  6.  Página Settings
 * ═══════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const c = useSettingsController();
  if (!c.isLoggedIn) return <Layout.Spinner />;

  return (
    <>
      <SettingsTemplate
        currentRoute={c.currentRoute}
        goToRoute={c.goToRoute}
        isLoggedIn
        onLoginClick={() => {}}
        onLogoutClick={c.onLogoutClick}
        userAvatarUrl={c.userAvatarUrl}
        showProfileMenu={c.profileMenuOpen}
        profileMenuRef={c.profileMenuRef}
        toggleProfileMenu={c.toggleProfileMenu}
        onCreateClick={() => c.goToRoute("create", "/create")}
      >
        {/* menu interno */}
        <div className="flex gap-6 border-b border-gray-700 mb-4">
          {(["conta", "perfil"] as const).map((t) => (
            <button
              key={t}
              className={`pb-2 ${
                c.tab === t ? "text-white border-b-2 border-[#5c64f4]" : "text-gray-400"
              }`}
              onClick={() => c.setTab(t)}
            >
              {t === "conta" ? "Conta" : "Perfil"}
            </button>
          ))}
        </div>

        {/* conteúdo */}
        {c.tab === "conta" ? (
          <AccountTab
            user={c.user!}
            openPasswordModal={() => c.setActiveModal("password")}
            openDeleteModal={() => c.setActiveModal("delete")}
            openEmailModal={() => c.setActiveModal("email")}
            openGeneroModal={() => c.setActiveModal("genero")}
          />
        ) : (
          <ProfileTab
            user={c.user!}
            openDisplayModal={() => c.setActiveModal("displayName")}
            openBioModal={() => c.setActiveModal("bio")}
            openAvatarModal={() => c.setActiveModal("avatar")}
            openBannerModal={() => c.setActiveModal("banner")}
            openApelidoModal={() => c.setActiveModal("apelido")}
          />
        )}
      </SettingsTemplate>

      {/* ────── Modais ────── */}
      {c.activeModal === "password" && (
        <PasswordModal
          state={c.pwdState}
          setState={c.setPwdState}
          onSave={c.changePassword}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "delete" && (
        <DeleteModal
          pwd={c.deletePwd}
          setPwd={c.setDeletePwd}
          onDelete={c.deleteAccount}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "displayName" && (
        <DisplayNameModal
          current={c.user!.nome}
          onSave={(v) => c.updateField("nome", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "apelido" && (
        <ApelidoModal
          current={c.user!.apelido}
          onSave={(v) => c.updateField("apelido", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "bio" && (
        <BioModal
          current={c.user!.bio}
          onSave={(v) => c.updateField("bio", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "avatar" && (
        <AvatarModal
          current={c.user!.avatar_url || "/images/standard_icon.png"}
          onSave={(v) => c.updateField("avatar_url", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "banner" && (
        <BannerModal
          current={c.user!.banner_url || ""}
          onSave={(v) => c.updateField("banner_url", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "email" && (
        <EmailModal
          current={c.user!.email || ""}
          onSave={(v) => c.updateField("email", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
      {c.activeModal === "genero" && (
        <GeneroModal
          current={c.user!.genero || ""}
          onSave={(v) => c.updateField("genero", v)}
          onClose={() => c.setActiveModal(null)}
        />
      )}
    </>
  );
}
