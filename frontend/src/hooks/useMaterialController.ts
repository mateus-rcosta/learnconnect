import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------
 * Tipos auxiliares
 * ------------------------------------------------------------- */
type ModalType = "login" | "register" | "reset" | "support" | null;

interface Usuario {
  id: string;
  nome: string;
  apelido: string;
  avatar_url?: string;
  banner_url?: string;
  descricao?: string;
}

interface Comentario {
  id: string;
  conteudo: string;
  usuario: Usuario;
}

/* ---------------------------------------------------------------
 * Hook
 * ------------------------------------------------------------- */
export function useMaterialController() {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const router = useRouter();
  const { id } = router.query as { id?: string };

  /* ---------- Auth ------------------------------------------------ */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [registerErr, setRegisterErr] = useState<string | null>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const j = await fetch(`${apiUrl}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      if (j.data) {
        setIsLoggedIn(true);
        setUser(j.data);
      }
    } catch {
      /* silencia */
    }
  };

  /* ---------- Profile-menu --------------------------------------- */
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  /* ---------- Post / likes --------------------------------------- */
  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [shares, setShares] = useState(0);

  /* ---------- Comments ------------------------------------------- */
  const [comments, setComments] = useState<Comentario[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");

  /* ---------- Profile / Author modals --------------------------- */
  const [profileModal, setProfileModal] = useState<Usuario | null>(null);

  const [authorModal, setAuthorModal] = useState(false);
  const [authorData, setAuthorData] = useState<Usuario | null>(null);

  /* ===============================================================
   * 1. Checa login na montagem
   * ============================================================= */
  useEffect(() => {
    fetchUser();
  }, []);

  /* ===============================================================
   * 2. Carrega material + like info
   * ============================================================= */
  useEffect(() => {
    if (!id) return;

    setLoadingPost(true);
    fetch(`${apiUrl}/api/material/${id}`)
      .then((r) => r.json())
      .then((j) => setPost(j.data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoadingPost(false));

    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/like/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => r.json())
      .then((j) => {
        setLikes(j.totalLikes ?? 0);
        setUserHasLiked(j.userHasLiked ?? false);
      })
      .catch(() => {});
  }, [id, apiUrl]);

  /* ===============================================================
   * 3. Comentários
   * ============================================================= */
  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const j = await fetch(`${apiUrl}/api/comentario/${id}`).then((r) =>
        r.json()
      );
      setComments(Array.isArray(j.data?.data) ? j.data.data : []);
    } catch {
      /* ignore */
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  /* ===============================================================
   * 4. Likes / share / comment
   * ============================================================= */
  async function toggleLike() {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }

    const token = localStorage.getItem("token")!;
    const r = await fetch(`${apiUrl}/api/like/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    if (r.message?.includes("adicionada")) {
      setLikes((l) => l + 1);
      setUserHasLiked(true);
    }
    if (r.message?.includes("removida")) {
      setLikes((l) => Math.max(0, l - 1));
      setUserHasLiked(false);
    }
  }

  function share() {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    setShares((s) => s + 1);
  }

  async function sendComment() {
    const content = newComment.trim();
    if (!content) return;
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }

    const token = localStorage.getItem("token")!;
    await fetch(`${apiUrl}/api/comentario/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ conteudo: content }),
    });
    setNewComment("");
    fetchComments();
  }

  /* ===============================================================
   * 5. Modal de Autor – busca dados quando aberto
   * ============================================================= */
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!authorModal || !post?.usuario?.id) return;
      try {
        const j = await fetch(
          `${apiUrl}/api/usuarios/${post.usuario.id}`
        ).then((r) => r.json());
        setAuthorData(j.data);
      } catch {
        setAuthorData(null);
      }
    };
    fetchAuthor();
  }, [authorModal, post?.usuario?.id, apiUrl]);

  /* ===============================================================
   * 6. Auth helpers (login / register / logout)
   * ============================================================= */
  function handleLogin() {
    if (isLoggedIn) return;
    setActiveModal("login");
  }
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  }

  async function doLogin(email: string, senha: string) {
    setLoginErr(null);
    try {
      const r = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const j = await r.json();
      if (r.ok && j.data?.token) {
        localStorage.setItem("token", j.data.token);
        await fetchUser();
        setIsLoggedIn(true);
        setActiveModal(null);
      } else {
        setLoginErr(j.message || "Erro ao fazer login.");
      }
    } catch {
      setLoginErr("Erro inesperado.");
    }
  }

  async function doRegister(
    name: string,
    nick: string,
    email: string,
    pwd: string,
    birth?: string
  ) {
    setRegisterErr(null);
    const payload: Record<string, any> = {
      nome: name,
      apelido: nick,
      email,
      senha: pwd,
    };
    if (birth) payload.data_nascimento = birth;

    try {
      const r = await fetch(`${apiUrl}/api/auth/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (r.ok && j.data?.token) {
        localStorage.setItem("token", j.data.token);
        await fetchUser();
        setIsLoggedIn(true);
        setActiveModal(null);
      } else {
        setRegisterErr(j.message || "Erro ao registrar.");
      }
    } catch {
      setRegisterErr("Erro inesperado.");
    }
  }

  /* ===============================================================
   * 7. Export
   * ============================================================= */
  return {
    /* navegação */
    router,
    id,

    /* menu/avatar */
    profileMenuRef,
    profileMenuOpen,
    setProfileMenuOpen,

    /* auth */
    isLoggedIn,
    user,
    handleLogin,
    handleLogout,
    doLogin,
    doRegister,
    activeModal,
    setActiveModal,
    loginErr,
    registerErr,

    /* post */
    post,
    loadingPost,
    error,

    /* likes & shares */
    likes,
    userHasLiked,
    toggleLike,
    shares,
    share,

    /* comments */
    comments,
    loadingComments,
    newComment,
    setNewComment,
    sendComment,

    /* modais de perfil */
    authorModal,
    setAuthorModal,
    authorData,
    profileModal,
    setProfileModal,
  };
}
