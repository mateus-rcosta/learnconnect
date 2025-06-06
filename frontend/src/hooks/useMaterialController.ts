//src/hooks/useMaterialController.ts
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export function useMaterialController() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  const [post,  setPost ] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  const [likes,        setLikes]        = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [shares,       setShares]       = useState(0);

  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");

  const [authorModal,    setAuthorModal]    = useState(false);
  const [authorData,     setAuthorData]     = useState<any>(null);
  const [profileModal,   setProfileModal]   = useState<any>(null);

  /* =================================================
   * 1. Autenticação
   * =================================================*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${apiUrl}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(j => {
        setUser(j.data);
        setIsLoggedIn(true);
      })
      .catch(() => {});
  }, [apiUrl]);

  /* =================================================
   * 2. Material + likes  (quando id disp.)
   * =================================================*/
  useEffect(() => {
    if (!id) return;

    setLoadingPost(true);
    fetch(`${apiUrl}/api/material/${id}`)
      .then(r => r.json())
      .then(j => setPost(j.data))
      .catch(err => setError(String(err)))
      .finally(() => setLoadingPost(false));

    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/like/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(r => r.json())
      .then(j => {
        setLikes(j.totalLikes ?? 0);
        setUserHasLiked(j.userHasLiked ?? false);
      })
      .catch(() => {});
  }, [id, apiUrl]);

  /* =================================================
   * 3. Comentários
   * =================================================*/
  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const j = await fetch(`${apiUrl}/api/comentario/${id}`).then(r => r.json());
      setComments(Array.isArray(j.data?.data) ? j.data.data : []);
    } catch {}
    setLoadingComments(false);
  };

  useEffect(() => { fetchComments(); }, [id]);

  /* =================================================
   * 4. Ações
   * =================================================*/
  async function toggleLike() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login para curtir");
    const r = await fetch(`${apiUrl}/api/like/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());

    if (r.message?.includes("adicionada"))  { setLikes(l => l + 1); setUserHasLiked(true);  }
    if (r.message?.includes("removida"))    { setLikes(l => Math.max(0, l - 1)); setUserHasLiked(false); }
  }

  function share() {
    if (!isLoggedIn) return alert("Faça login para compartilhar");
    navigator.clipboard.writeText(window.location.href);
    setShares(s => s + 1);
  }

  async function sendComment() {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login para comentar");
    await fetch(`${apiUrl}/api/comentario/${id}`, {
      method : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body   : JSON.stringify({ conteudo: newComment }),
    });
    setNewComment("");
    fetchComments();
  }

  /* =================================================
   * 5. Export
   * =================================================*/
  return {
    profileMenuRef, profileMenuOpen, setProfileMenuOpen,
    isLoggedIn, user,

    router, id,

    post, loadingPost, error,

    likes, userHasLiked, toggleLike,
    shares, share,

    comments, loadingComments,
    newComment, setNewComment, sendComment,

    authorModal, setAuthorModal, authorData, setAuthorData,
    profileModal, setProfileModal,

    fetchComments,
  };
}
