//src/hooks/useNewHomeController.ts
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
const tag = (id: string, ...rest: any[]) =>
  console.log(`%c[IO] ${id}`, 'color:#6cf', ...rest);

interface Autor {
  nome: string;
  apelido: string;
  avatar_url?: string;
}

interface Categoria {
  nome: string;
  descricao?: string;
}

interface Material {
  id: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  usuario: Autor;
  data_criacao: string;
  flag: boolean;
  thumbnail_url?: string;
}

export function useNewHomeController() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState("/images/standard_icon.png");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentRoute, setCurrentRoute] = useState("home");

  const [likeAnimations, setLikeAnimations] = useState<Record<string, boolean>>({});
  const [postStates, setPostStates] = useState<Record<string, { likes: number; showComments: boolean; showShare: boolean }>>({});
  const [likeWarnId, setLikeWarnId] = useState<string | null>(null);

  const [allPosts, setAllPosts] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [activeModal, setActiveModal] = useState<"login" | "register" | "reset" | "support" | null>(null);
  const router = useRouter();

  const pageRef = useRef(page);
  const isLoadingRef = useRef(isLoadingPosts);
  
  const sentinelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [registerErr, setRegisterErr] = useState<string | null>(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    isLoadingRef.current = isLoadingPosts;
  }, [isLoadingPosts]);

  

  function updateAvatarLocally(newUrl: string) {
    setUserAvatarUrl(newUrl || "/images/standard_icon.png");
  }

  async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.data) {
        const avatar = data.data.avatar_url;
        setUserAvatarUrl(avatar || "/images/standard_icon.png");
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }

  async function checkAuthStatus() {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setIsLoggedIn(true);
        setUserAvatarUrl(json.data.avatar_url || "/images/standard_icon.png");
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  }

/** (re)liga o IntersectionObserver */
/** (re)liga o IntersectionObserver */
const attachObserver = () => {
  /* 1 – sempre derruba o observer atual */
  observerRef.current?.disconnect();
  observerRef.current = null;

  /* 2 – só cria quando feed + sentinela já estão no DOM ------------- */
  const start = performance.now();
  const waitForNodes = () => {
    const container = feedRef.current;   // root = main que rola
    const sentinel  = sentinelRef.current;

    if (!container || !sentinel) {          // ainda não existem
      if (performance.now() - start < 500)  // tenta por 500 ms
        requestAnimationFrame(waitForNodes);
      return;
    }

    /* 3 – agora sim cria o IO --------------------------------------- */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          fetchPosts(pageRef.current);      // carrega a próxima página
        }
      },
      {
        root: container,                    // viewport = o próprio feed
        rootMargin: "0px 0px 200px 0px",    // pré-carrega 200 px antes
        threshold: 0,
      }
    );

    io.observe(sentinel);                   // começa a observar
    observerRef.current = io;               // guarda instância
  };

  requestAnimationFrame(waitForNodes);
};





  async function fetchPosts(pageNumber: number) {
    tag('fetch()', pageNumber);
    if (isLoadingRef.current || !hasMore) return;
    tag('fetch() → SKIP', { isLoading: isLoadingRef.current, hasMore });

    isLoadingRef.current = true;
    setIsLoadingPosts(true);
    try {
      const res = await fetch(`${apiUrl}/api/material?page=${pageNumber}&limit=${limit}`);
      const json = await res.json(); 
      const materiaisData: Material[] = json.data.data.map((m: any) => ({ 
      ...m, 
      flag: 
      m.flag === true  || 
      m.flag === 1     || 
      m.flag === "true", 
    }));
      if (materiaisData.length < limit) setHasMore(false);
      setAllPosts((prev) => [...prev, ...materiaisData.filter((p) => !prev.some((x) => x.id === p.id))]);

      const novosEstados: Record<string, { likes: number; showComments: boolean; showShare: boolean }> = {};
      await Promise.all(
        materiaisData.map(async (material) => {
          try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const resLike = await fetch(`${apiUrl}/api/like/${material.id}`, { method: "GET", headers });
            const likeData = await resLike.json();
            novosEstados[material.id] = {
              likes: resLike.ok ? likeData.data?.totalLikes || 0 : 0,
              showComments: false,
              showShare: false,
            };
          } catch {
            novosEstados[material.id] = { likes: 0, showComments: false, showShare: false };
          }
        })
      );
      setPostStates((prev) => ({ ...prev, ...novosEstados }));
      setPage(prev => { 
        const next = prev + 1; 
        pageRef.current = next;    // 👈 garante valor correto para o IO seguinte 
        return next; 
      });
      requestAnimationFrame(attachObserver);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    } finally {
        setIsLoadingPosts(false);
        isLoadingRef.current = false;
        /* recria o IO – SEM passar pelo requestAnimationFrame aqui */
        attachObserver();
      }
  }

  // depois de attachObserver()
const kickObserverWhenScrollable = () => {
  const start = performance.now();
  const check = () => {
    const el = feedRef.current;
    if (!el) return;               // ainda não montou

    /* barra apareceu (scrollHeight > clientHeight) */
    if (el.scrollHeight > el.clientHeight) {
      attachObserver();            // garante que o sentinel está observado
      return;                      // para o polling
    }

    /*  pára depois de 500 ms para não ficar rodando à toa  */
    if (performance.now() - start < 500) {
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
};


  function resetAndFetchPosts() {
    setAllPosts([]);
    setPostStates({});
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }

  function goToRoute(routeName: string, path: string) {
    setCurrentRoute(routeName);
    router.push(path);
  }

  async function doRegister(
  nome: string,
  apelido: string,
  email: string,
  senha: string,
  dataNascimento?: string
) {
  setRegisterErr(null);

  /* --- 1.  monta o payload que a API espera --- */
  const payload: Record<string, any> = {
    nome,          // ✅ coluna NOT NULL no banco
    apelido,       // ✅ unique / NOT NULL
    email,
    senha,
  };
  if (dataNascimento) payload.data_nascimento = dataNascimento;

  try {
    /* --- 2.  envia o payload --- */
    const response = await fetch(`${apiUrl}/api/auth/cadastrar`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      await fetchUserProfile();
      setIsLoggedIn(true);
      setActiveModal(null);
    } else {
      setRegisterErr(data.message || "Erro ao registrar.");
    }
  } catch (err) {
    console.error(err);
    setRegisterErr("Erro inesperado ao tentar registrar.");
  }
}


  function handleLogin() {
    if (isLoggedIn) return;
    setActiveModal("login");
  }

  async function doLogin(email: string, senha: string) {
  setLoginErr(null);
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const data = await response.json();

    if (response.ok && data.data?.token) {
      localStorage.setItem("token", data.data.token);
      await fetchUserProfile();
      setIsLoggedIn(true);
      await fetchUserProfile();
      setActiveModal(null);
    } else {
      setLoginErr(data.message || "Erro ao fazer login.");
    }
  } catch (err) {
    console.error(err);
    setLoginErr("Erro inesperado ao tentar logar.");
  }
}

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.reload();
  }

  function openPostPage(postId: string) {
    router.push(`/material/${postId}`);
  }

  async function handleLike(postId: string) {
    if (!isLoggedIn) {
      setLikeWarnId(postId);
      return;
    }
    setLikeWarnId(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/api/like/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return;
      const isLikeAdded = data.data?.message === "Curtida adicionada com sucesso!";
      setPostStates((prev) => {
        const current = prev[postId] || { likes: 0, showComments: false, showShare: false };
        return {
          ...prev,
          [postId]: {
            ...current,
            likes: Math.max(0, current.likes + (isLikeAdded ? 1 : -1)),
          },
        };
      });
      setLikeAnimations((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => setLikeAnimations((prev) => ({ ...prev, [postId]: false })), 300);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  }

  function toggleComments(postId: string) {
    setPostStates((prev) => {
      const current = prev[postId];
      return {
        ...prev,
        [postId]: {
          ...current,
          showComments: !current.showComments,
        },
      };
    });
  }

  function toggleShare(postId: string) {
    setPostStates((prev) => {
      const current = prev[postId];
      return {
        ...prev,
        [postId]: {
          ...current,
          showShare: !current.showShare,
        },
      };
    });
  }

  useEffect(() => {
  if (router.pathname !== "/") return; 
  tag('===== ENTER / =====');


  

  /* (re)inicializa estados --------------- */
  setAllPosts([]);
  setPostStates({});
  setPage(1);
  pageRef.current = 1;
  setHasMore(true);
  setIsLoadingPosts(false);
  isLoadingRef.current = false;
  checkAuthStatus(); 
  fetchUserProfile();

   (async () => { 
   await fetchPosts(1); 
   kickObserverWhenScrollable();
   attachObserver(); 
 })();
  
}, [router.pathname]);


useEffect(() => {
  if (router.pathname !== "/") return;
  if (!feedRef.current) return; 
  attachObserver(); 
  return () => observerRef.current?.disconnect();
}, [router.pathname, allPosts.length]);


useEffect(() => {
  return () => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  };
}, [router.pathname]);

  return {
    apiUrl,
    isLoggedIn,
    userAvatarUrl,
    profileMenuOpen,
    setProfileMenuOpen,
    profileMenuRef,
    currentRoute,
    goToRoute,
    likeAnimations,
    postStates,
    likeWarnId,
    allPosts,
    isLoadingPosts,
    activeModal,
    setActiveModal,
    feedRef,
    sentinelRef,
    handleLogin,
    handleLogout,
    doLogin,
    doRegister,
    loginErr,
    registerErr,
    handleLike,
    toggleComments,
    toggleShare,
    openPostPage,
  };
}
