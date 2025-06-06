import { useState, useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/router";


type ModalType = "login" | "register" | "reset" | "support" | null;

export default function DiscordPage() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Estados de autenticação / avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState("/images/standard_icon.png");

  // Menu de perfil
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Modal de login/registro/etc
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Controla rota atual do menu lateral
  const [currentRoute, setCurrentRoute] = useState("discord");

  const router = useRouter();

  // Checa token e busca avatar
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
      console.error("Erro ao verificar token:", err);
      setIsLoggedIn(false);
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // ou router.reload()
  }

  // Ao montar, verifica login
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fecha o menu de perfil ao clicar fora
  function handleClickOutside(e: MouseEvent) {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(e.target as Node)
    ) {
      setProfileMenuOpen(false);
    }
  }
  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  // Navegação lateral
  function goToRoute(routeName: string, path: string) {
    setCurrentRoute(routeName);
    router.push(path);
  }

  // Função para abrir o modal de Login
  function openLoginModal() {
    if (isLoggedIn) return;
    setActiveModal("login");
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white flex relative overflow-visible">
      {/* Barra Lateral */}
      <aside
        className="hidden sm:flex flex-col w-60 bg-[#1a1a1a] p-4 relative"
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center mb-8">
          <img src="/images/logotipo.png" alt="LearnConnect Logo" className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold text-[#5c64f4]">LearnConnect</span>
        </div>

        <nav className="flex flex-col gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("home", "/");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "home" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/home.png" alt="Home" className="w-5 h-5" />
            <span>Home</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("popular", "/popular");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "popular" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/popular.png" alt="Popular" className="w-5 h-5" />
            <span>Popular</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("explore", "/explore");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "explore" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/explore.png" alt="Explore" className="w-5 h-5" />
            <span>Explore</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("discord", "/discord");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "discord" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/comunidades.png" alt="Discord" className="w-5 h-5" />
            <span>Discord</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("topics", "/topics");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "topics" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/topicos.png" alt="Tópicos" className="w-5 h-5" />
            <span>Tópicos</span>
          </a>

          <a
  href="https://cai0duque.github.io/website-duque/"
  target="_blank"
  rel="noopener noreferrer"
  className={`flex items-center gap-2 transition hover:text-[#5c64f4]`}
>
  <img src="/images/conheca-nos.png" alt="Conheça-nos" className="w-5 h-5" />
  <span>Conheça-nos</span>
</a>

        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col relative overflow-visible">
        {/* Barra Superior */}
        <header
          className="flex items-center justify-between bg-[#1a1a1a] p-3 sm:p-4 relative"
          style={{ zIndex: 9999 }}
        >
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full bg-[#121212] text-white px-4 py-2 pl-10 focus:outline-none"
              />
              <img
                src="/images/search.png"
                alt="Search Icon"
                className="absolute w-5 h-5 top-2.5 left-3"
              />
            </div>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1 bg-[#1a1a1a] border border-[#5c64f4] rounded-full px-4 py-2 hover:bg-[#2a2a2a]"
                onClick={() => router.push("/create")}
              >
                <img src="/images/criar.png" alt="Criar" className="w-5 h-5" />
                <span>Criar</span>
              </button>
              <button className="relative">
                <img
                  src="/images/notificacoes.png"
                  alt="Notificações"
                  className="w-6 h-6"
                />
              </button>

              <div className="relative" ref={profileMenuRef}>
                <img
                  src={userAvatarUrl}
                  alt="Perfil"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                />
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 
                               rounded-lg shadow-[0_0_10px_#5c64f4] transition-all duration-300"
                  >
                    <ul className="py-2 text-sm">
                      <li className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2">
                        <img
                          src="/images/myposts.png"
                          alt="Minhas postagens"
                          className="w-4 h-4"
                        />
                        Minhas postagens
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
                        onClick={() => router.push("/settings")}
                      >
                        <img
                          src="/images/Config.png"
                          alt="Configurações"
                          className="w-4 h-4"
                        />
                        Configurações
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2 text-red-400"
                        onClick={handleLogout}
                      >
                        <img
                          src="/images/logoff.png"
                          alt="Sair"
                          className="w-4 h-4"
                        />
                        Sair
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
              onClick={openLoginModal}
            >
              Entrar
            </button>
          )}
        </header>

        {/* Conteúdo principal: Banner e informações */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 relative"
          style={{ scrollBehavior: "smooth" }}
        >
          <div
            className="relative w-full h-40 sm:h-60 md:h-72 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('/images/servidorbanner.png')",
            }}
          ></div>

          <div className="relative -mt-10 flex justify-center">
            <img
              src="/images/servidordc.png"
              alt="Ícone do Servidor"
              className="w-24 h-24 rounded-full border-4 border-[#121212] object-cover"
            />
          </div>

          <section className="text-center mt-4">
            <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
              Old Duque's
              <img
                src="/images/dccomunidadeicon.png"
                alt="Ícone Comunidade"
                className="w-5 h-5"
              />
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              <span>207 Membros</span> • <span className="text-green-400">55 Online</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">Est. Ago 2020</p>
            <p className="text-sm text-gray-300 mt-3 w-full sm:w-3/4 md:w-1/2 mx-auto">
              Um lugar dedicado... Nosso próprio servidor no Discord. <br />
              Encontre colegas de aprendizado e caminhada, ou ensine os outros!<br />
              Networking é nosso sobrenome aqui. Com requinte, você é bem vindo(a)!
            </p>
            <div className="mt-4">
              <a
                href="https://discord.gg/wDMfTdkF79"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#5c64f4] text-white px-6 py-2 text-lg font-semibold rounded-full
                           transition hover:bg-white hover:text-[#5c64f4]
                           hover:shadow-[0_0_10px_#5c64f4]"
              >
                Ir para o servidor
              </a>
            </div>
          </section>
        </main>
      </div>

      {/* Modais de Login, Registro, Reset, Suporte */}
      {activeModal === "login" && <LoginModal setActiveModal={setActiveModal} setIsLoggedIn={setIsLoggedIn} fetchUserProfile={checkAuthStatus} />}
      {activeModal === "register" && <RegisterModal setActiveModal={setActiveModal} setIsLoggedIn={setIsLoggedIn} fetchUserProfile={checkAuthStatus} />}
      {activeModal === "reset" && <ResetPasswordModal setActiveModal={setActiveModal} />}
      {activeModal === "support" && <SupportModal setActiveModal={setActiveModal} />}
    </div>
  );
}

/* ------------- Abaixo, os componentes de modal ------------- */

// Props do modal de login
function LoginModal({
  setActiveModal,
  setIsLoggedIn,
  fetchUserProfile,
}: {
  setActiveModal: (m: ModalType) => void;
  setIsLoggedIn: (b: boolean) => void;
  fetchUserProfile: () => Promise<void>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function doLogin() {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      if (response.ok && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        setIsLoggedIn(true);
        await fetchUserProfile(); // atualiza avatar etc.
        setActiveModal(null);
        setErro("");
      } else {
        setErro(data.message || "Erro ao fazer login.");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      setErro("Erro inesperado ao tentar logar.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-96 max-w-full p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => setActiveModal(null)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Entrar</h2>
        <p className="text-sm text-gray-400 mb-4">
          Ao continuar, você concorda com nosso Contrato de Usuário e reconhece que compreende nossa Política de Privacidade.
        </p>
        {erro && <div className="text-red-400 text-sm mb-2">{erro}</div>}
        <div className="mb-2">
          <label className="block text-sm mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="usuario@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Senha *</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="********"
          />
        </div>
        <div
          className="text-right text-sm text-[#5c64f4] hover:underline cursor-pointer mb-4"
          onClick={() => setActiveModal("reset")}
        >
          Esqueceu a senha?
        </div>
        <button
          className="bg-[#5c64f4] w-full py-2 rounded font-bold hover:opacity-90"
          onClick={doLogin}
        >
          Entrar
        </button>
        <div className="text-center text-sm mt-3">
          Primeira vez no LearnConnect?{" "}
          <span
            className="text-[#5c64f4] cursor-pointer"
            onClick={() => setActiveModal("register")}
          >
            Cadastre-se
          </span>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({
  setActiveModal,
  setIsLoggedIn,
  fetchUserProfile,
}: {
  setActiveModal: (m: ModalType) => void;
  setIsLoggedIn: (b: boolean) => void;
  fetchUserProfile: () => Promise<void>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [erro, setErro] = useState("");

  async function doRegister() {
    const validRegex = /^[a-z0-9_]+$/;
    const novoApelido = apelido.trim().toLowerCase();

    if (!email || !senha || !nome || !novoApelido || !dataNascimento) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (novoApelido.length < 3 || novoApelido.length > 32) {
      setErro("O nome de usuário deve ter entre 3 e 32 caracteres.");
      return;
    }
    if (!validRegex.test(novoApelido)) {
      setErro("Use apenas letras minúsculas, números ou underline no nome de usuário.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha,
          nome,
          apelido: novoApelido,
          data_nascimento: dataNascimento,
        }),
      });
      const data = await response.json();
      if (response.ok && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        setIsLoggedIn(true);
        await fetchUserProfile();
        setActiveModal(null);
        setErro("");
      } else {
        setErro(data.message || "Erro ao registrar.");
      }
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setErro("Erro inesperado ao tentar registrar.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-96 max-w-full p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => setActiveModal(null)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Cadastrar-se</h2>
        <p className="text-sm text-gray-400 mb-4">
          Ao continuar, você concorda com nosso Contrato de Usuário e reconhece que compreende nossa Política de Privacidade.
        </p>
        {erro && <div className="text-red-400 text-sm mb-2">{erro}</div>}
        <div className="mb-2">
          <label className="block text-sm mb-1">Apelido *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="Como as pessoas vão te chamar"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Nome de usuário *</label>
          <input
            type="text"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="nome_legal"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="usuario@email.com"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Data de Nascimento *</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Senha *</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="********"
          />
        </div>
        <button
          className="bg-[#5c64f4] w-full py-2 rounded font-bold hover:opacity-90"
          onClick={doRegister}
        >
          Cadastrar
        </button>
        <div className="text-center text-sm mt-3">
          Já estuda por aqui?{" "}
          <span
            className="text-[#5c64f4] cursor-pointer"
            onClick={() => setActiveModal("login")}
          >
            Entrar
          </span>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({
  setActiveModal,
}: {
  setActiveModal: (m: ModalType) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-96 max-w-full p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => setActiveModal(null)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Redefina sua senha</h2>
        <p className="text-sm text-gray-400 mb-4">
          Insira o seu email e enviaremos um link para a redefinição da senha
        </p>
        <div className="mb-2">
          <label className="block text-sm mb-1">Email de usuário *</label>
          <input
            type="text"
            className="w-full bg-[#121212] p-2 rounded focus:outline-none"
            placeholder="Seu email cadastrado"
          />
        </div>
        <div
          className="text-sm text-[#5c64f4] hover:underline cursor-pointer mb-4"
          onClick={() => setActiveModal("support")}
        >
          Precisa de ajuda?
        </div>
        <button className="bg-[#5c64f4] w-full py-2 rounded font-bold hover:opacity-90">
          Redefinir senha
        </button>
      </div>
    </div>
  );
}

function SupportModal({
  setActiveModal,
}: {
  setActiveModal: (m: ModalType) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => setActiveModal(null)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Ajuda e Suporte</h2>
        <p className="text-sm text-gray-400 mb-4">
          Para redefinir a senha, você precisará de acesso ao seu email.
          Se estiver com problemas ou não tiver mais acesso ao email, entre em
          contato com nossa equipe de suporte.
        </p>
        <p className="text-sm text-gray-400">
          Suporte LearnConnect:
          <br />
          <span className="text-[#5c64f4]">suporte@learnconnect.example.com</span>
        </p>
      </div>
    </div>
  );
}
