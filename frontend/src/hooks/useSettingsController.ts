/* ------------------------------------------------------------------ */
/*  src/hooks/useSettingsController.ts – versão completa e atualizada */
/* ------------------------------------------------------------------ */
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/* ─────────── Tipos ─────────── */
type Modal =
  | "password"
  | "delete"
  | "displayName"
  | "bio"
  | "avatar"
  | "banner"
  | "email"
  | "genero"
  | "apelido"
  | null;

type Tab = "conta" | "perfil";

export interface User {
  nome: string;
  apelido: string;
  bio: string;
  avatar_url?: string;
  banner_url?: string;
  email?: string;
  genero?: string;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useSettingsController() {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const router = useRouter();

  /* ─────────── Auth & menu ─────────── */
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const profileMenuRef                      = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  /* ─────────── Dados de usuário ─────── */
  const [user, setUser] = useState<User | null>(null);

  /* ─────────── UI / estado local ────── */
  const [tab, setTab]                   = useState<Tab>("conta");
  const [activeModal, setActiveModal]   = useState<Modal>(null);

  const [pwdState, setPwdState] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [deletePwd, setDeletePwd] = useState("");

  /* =================================================================
   * 1.   Verifica login e carrega perfil
   * =============================================================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    fetch(`${apiUrl}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((j) => {
        if (!j.data) throw new Error();
        setIsLoggedIn(true);
        setUser(j.data);
      })
      .catch(() => router.replace("/"));
  }, [apiUrl, router]);

  /* =================================================================
   * 2.   Atualização de perfil
   *      (avatar/banner usam endpoints próprios)
   * =============================================================== */
  async function updateField(key: keyof User, value: string) {
    const token = localStorage.getItem("token")!;
    let endpoint = "/api/settings/atualiza-perfil";
    let body: Record<string, any> = { [key]: value };

    if (key === "avatar_url")       endpoint = "/api/settings/atualiza-avatar";
    else if (key === "banner_url")  endpoint = "/api/settings/atualiza-banner";

    const res  = await fetch(`${apiUrl}${endpoint}`, {
      method : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message || "Erro ao atualizar perfil.");
      throw new Error(json.message);
    }

    /* sucesso → reflete na UI imediatamente */
    setUser((u) => (u ? { ...u, ...body } : u));
    toast.success("Alteração salva!");
  }

  /* =================================================================
   * 3.   Trocar senha
   * =============================================================== */
  async function changePassword() {
    const { current, new: nova, confirm } = pwdState;
    if (!current || !nova || !confirm) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (nova !== confirm) {
      toast.error("Senhas não coincidem.");
      return;
    }

    const token = localStorage.getItem("token")!;
    const res   = await fetch(`${apiUrl}/api/settings/atualiza-senha`, {
      method : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`,
      },
      body: JSON.stringify({ senhaAtual: current, novaSenha: nova }),
    });

    const json = await res.json();
    if (res.ok) {
      toast.success("Senha alterada!");
      setActiveModal(null);
      setPwdState({ current: "", new: "", confirm: "" });
    } else {
      toast.error(json.message || "Erro ao alterar senha.");
    }
  }

  /* =================================================================
   * 4.   Excluir conta
   * =============================================================== */
  async function deleteAccount() {
    if (!deletePwd) {
      toast.error("Digite a senha para confirmar.");
      return;
    }
    const token = localStorage.getItem("token")!;
    const res   = await fetch(`${apiUrl}/api/settings/deleta-conta`, {
      method : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`,
      },
      body: JSON.stringify({ senha: deletePwd }),
    });
    const json  = await res.json();

    if (res.ok) {
      toast.success("Conta excluída!");
      localStorage.clear();
      router.replace("/");
    } else {
      toast.error(json.message || "Erro ao excluir conta.");
    }
  }

  /* =================================================================
   * 5.   Logout
   * =============================================================== */
  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/");
  }

  /* =================================================================
   * 6.   Exports
   * =============================================================== */
  return {
    /* navegação global */
    currentRoute: "settings" as const,
    goToRoute   : (_: string, path: string) => router.push(path),

    /* auth + avatar */
    isLoggedIn,
    userAvatarUrl  : user?.avatar_url ?? "/images/standard_icon.png",
    onLogoutClick  : handleLogout,
    profileMenuRef,
    profileMenuOpen,
    toggleProfileMenu: () => setProfileMenuOpen((o) => !o),

    /* UI */
    tab,
    setTab,

    /* user data */
    user,
    updateField,

    /* senha / conta */
    pwdState,
    setPwdState,
    changePassword,
    deletePwd,
    setDeletePwd,
    deleteAccount,

    /* modais */
    activeModal,
    setActiveModal,
  };
}
