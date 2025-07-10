/* ------------------------------------------------------------------ */
/*  Hook useCreateController                                           */
/* ------------------------------------------------------------------ */
import { useRouter }          from "next/router";
import { useEffect, useRef, useState } from "react";
import toast                  from "react-hot-toast";

type Modal = "login" | "register" | "reset" | "support" | null;
type Tab   = "text" | "images";

export interface Categoria { nome: string }

export function useCreateController() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const router = useRouter();

  /* ───── auth ───── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState<any>(null);     // dados mínimos
  const profileMenuRef              = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeModal, setActiveModal]         = useState<Modal>(null);

  async function fetchMe() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res  = await fetch(`${apiUrl}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).catch(() => null);
    if (res?.data) {
      setIsLoggedIn(true);
      setUser(res.data);
    }
  }
  useEffect(() => { fetchMe(); }, []);

  /* ───── UI state ───── */
  const [tab, setTab]           = useState<Tab>("text");
  const [title, setTitle]       = useState("");
  const [body,  setBody]        = useState("");
  const [thumb, setThumb]       = useState<string>("");
  const [tag,   setTag]         = useState<string>("");
  const [tagSelector, setTagSelector] = useState(false);
  const [tagQuery, setTagQuery]       = useState("");
  const [posting,  setPosting]        = useState(false);

  /* ───── categorias ───── */
  const [cats, setCats] = useState<Categoria[]>([]);
  useEffect(() => {
    fetch(`${apiUrl}/api/categoria`)
      .then(r => r.json())
      .then(j => setCats(Array.isArray(j.data?.categorias) ? j.data.categorias : []))
      .catch(() => {});
  }, [apiUrl]);

  /* ───── helpers ───── */
  function handleLoginClick()  { setActiveModal("login"); }
  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/");
  }

  async function doLogin(email: string, senha: string) {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ email, senha }),
    });
    const j  = await res.json();
    if (res.ok && j.data?.token) {
      localStorage.setItem("token", j.data.token);
      await fetchMe();
      setActiveModal(null);
    } else toast.error(j.message || "Erro");
  }

  async function doRegister(
    name: string,
    nick: string,
    email: string,
    pwd:  string,
    birth?: string,
  ) {
    const res = await fetch(`${apiUrl}/api/auth/cadastrar`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        nome: name,
        apelido: nick,
        email,
        senha: pwd,
        ...(birth ? { data_nascimento: birth } : {}),
      }),
    });
    const j = await res.json();
    if (res.ok && j.data?.token) {
      localStorage.setItem("token", j.data.token);
      await fetchMe();
      setActiveModal(null);
    } else toast.error(j.message || "Erro");
  }

  function selectTag(t: string) {
    setTag(t);
    setTagSelector(false);
  }

  /* ───── postar ───── */
  async function postMaterial() {
    if (!title.trim())    { toast.error("Título obrigatório"); return; }
    if (!tag)             { toast.error("Escolha uma tag");   return; }
    if (!thumb.trim())    { toast.error("Cole a URL da imagem"); return; }
    if (!isLoggedIn)      { setActiveModal("login"); return; }

    const token = localStorage.getItem("token")!;
    const payload = {
      titulo        : title.trim(),
      descricao     : body || "Sem descrição",
      conteudo      : body,
      categoria     : tag,
      thumbnail_url : thumb.trim(),
    };

    setPosting(true);
    try {
      const res = await fetch(`${apiUrl}/api/material`, {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (res.ok) {
        toast.success("Material publicado!");
        router.replace("/");
      } else toast.error(j.message || "Erro");
    } catch {
      toast.error("Erro de rede");
    } finally { setPosting(false); }
  }

  /* ───── exposed ───── */
  return {
    /* nav */
    currentRoute: "create" as const,
    goToRoute: (_: string, p: string) => router.push(p),

    /* auth */
    isLoggedIn,
    user,
    userAvatarUrl: user?.avatar_url ?? "/images/standard_icon.png",
    profileMenuRef,
    profileMenuOpen,
    toggleProfileMenu: () => setProfileMenuOpen(o => !o),
    onLogoutClick  : handleLogout,
    onLoginClick   : handleLoginClick,

    /* login modals */
    activeModal,
    setActiveModal,
    doLogin,
    doRegister,

    /* form */
    tab, setTab,
    title, setTitle,
    body,  setBody,
    thumb, setThumb,
    tag,   setTag,
    tagSelector, setTagSelector,
    tagQuery,    setTagQuery,
    cats, selectTag,

    postMaterial,
    posting,
  };
}
