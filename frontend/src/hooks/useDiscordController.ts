// src/hooks/useDiscordController.ts
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

type ModalType = "login" | "register" | "reset" | "support" | null;

export function useDiscordController() {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  /* --- auth ----------------------------------------------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState("/images/standard_icon.png");

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [registerErr, setRegisterErr] = useState<string | null>(null);

  /* --- navegação ----------------------------------------------- */
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState("discord");
  function goToRoute(route: string, path: string) {
    setCurrentRoute(route);
    router.push(path);
  }

  /* --- helpers -------------------------------------------------- */
  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (res.ok && j.data) {
        setIsLoggedIn(true);
        setUserAvatarUrl(j.data.avatar_url || "/images/standard_icon.png");
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }

  /* --- login / register / logout ------------------------------- */
  function handleLogin() {
    if (isLoggedIn) return;
    setActiveModal("login");
  }
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  }

  async function doLogin(email: string, pwd: string) {
    setLoginErr(null);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: pwd }),
      });
      const j = await res.json();
      if (res.ok && j.data?.token) {
        localStorage.setItem("token", j.data.token);
        await fetchUser();
        setActiveModal(null);
      } else {
        setLoginErr(j.message || "Erro ao fazer login.");
      }
    } catch {
      setLoginErr("Erro inesperado ao logar.");
    }
  }

  async function doRegister(
    name: string,
    nickname: string,
    email: string,
    pwd: string,
    birth?: string
  ) {
    setRegisterErr(null);
    const body: Record<string, any> = {
      nome: name,
      apelido: nickname,
      email,
      senha: pwd,
    };
    if (birth) body.data_nascimento = birth;

    try {
      const res = await fetch(`${apiUrl}/api/auth/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (res.ok && j.data?.token) {
        localStorage.setItem("token", j.data.token);
        await fetchUser();
        setActiveModal(null);
      } else {
        setRegisterErr(j.message || "Erro ao registrar.");
      }
    } catch {
      setRegisterErr("Erro inesperado ao registrar.");
    }
  }

  /* --- init ----------------------------------------------------- */
  useEffect(() => {
    fetchUser();
  }, []);

  return {
    currentRoute,
    goToRoute,

    isLoggedIn,
    onLoginClick: handleLogin,
    onLogoutClick: handleLogout,
    doLogin,
    doRegister,

    userAvatarUrl,
    profileMenuOpen,
    setProfileMenuOpen,
    profileMenuRef,

    activeModal,
    setActiveModal,
    loginErr,
    registerErr,
  };
}
