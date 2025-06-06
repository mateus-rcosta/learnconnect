import { useState, useRef, MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";

export default function CreatePost() {
  // ---------------------------
  // 1) Estados e Funções de Login (simulados), iguais ao NewHome
  // ---------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);
  }, []);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>("/images/standard_icon.png");

  async function fetchUserProfile() {
    if (!token) return;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const contentType = res.headers.get("content-type");
  
      // Verifica se a resposta realmente é JSON antes de tentar usar res.json()
      if (!res.ok || !contentType?.includes("application/json")) {
        const text = await res.text(); // captura resposta HTML para debug
        console.error("Resposta inesperada do backend:", text);
        setIsLoggedIn(false);
        return;
      }
  
      const data = await res.json();
  
      if (data?.data) {
        setIsLoggedIn(true);
        setUserAvatarUrl(data.data.avatar_url || "/images/standard_icon.png");
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setIsLoggedIn(false);
    }
  }
  
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);
  

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      handleClickOutside(e);
    }
  
    window.addEventListener("mousedown", handleOutsideClick as any);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick as any);
    };
  }, []);
  
  


  // Menu lateral: controlamos a rota atual para destacar
  // Por exemplo, "create" ou "/", "/popular" etc.
  const [currentRoute, setCurrentRoute] = useState("create");

  function handleLogin() {
    if (!isLoggedIn) setIsLoggedIn(true);
  }
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push('/')
  }

  // Fechar menu de perfil se clicar fora
  function handleClickOutside(e: MouseEvent) {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(e.target as Node)
    ) {
      setProfileMenuOpen(false);
    }
  }

  // ---------------------------
  // 2) Estado para as abas e campos do formulário
  // ---------------------------
  type TabType = "text" | "images" | "link" | "poll";
  const [activeTab, setActiveTab] = useState<TabType>("text");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Em vez de array, agora guardamos apenas UMA tag obrigatória
  const [postTag, setPostTag] = useState<string>(""); // se vazio, não tem tag
  // Controla se o "pop-up" de seleção de tags está aberto
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Exemplo de manipulação de imagens (mock)
  const [images, setImages] = useState<File[]>([]);

  

  async function handlePost() {
    const postPayload = {
      titulo: title,
      descricao: body || "Sem descrição",
      categoria: postTag,
      conteudo: body,
      thumbnail_url: thumbnailPreview || "https://via.placeholder.com/300",
    };
    if (!title.trim()) {
      alert("O título não pode estar vazio.");
      return;
    }
    
    if (!postTag) {
      alert("É obrigatório escolher 1 tag antes de postar!");
      return;
    }

    if (!thumbnailPreview) {
      alert("Você precisa inserir uma imagem antes de postar.");
      return;
    }
  
    const token = localStorage.getItem("token");
    console.log("🔑 Token atual:", token);
    if (!token) {
      alert("Você precisa estar logado para postar.");
      return;
    }
  
    setIsPosting(true); // ⏳ Inicia o loader

try {

  console.log({
    titulo: title,
    descricao: body || "Sem descrição",
    categoria: postTag,
    conteudo: body,
    thumbnail_url: thumbnailPreview,
  });

  console.log("📤 Payload final:", postPayload);
  const response = await fetch(`${apiUrl}/api/material`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postPayload),
  });

  const data = await response.json();

  if (response.ok) {
    sessionStorage.setItem("newPostCreated", "true");
    setTimeout(() => {
      router.push("/");
    }, 100); // pequeno delay de 100ms
  }  
} catch (err) {
  console.error("Erro inesperado:", err);
  alert("Erro inesperado ao postar.");
} finally {
  setIsPosting(false); // ✅ Finaliza o loader
}

  }
  

  // ---------------------------
  // 3) Lógica de seleção de Tag
  // ---------------------------
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${apiUrl}/api/categoria`);
  
        const contentType = res.headers.get("content-type");
  
        // Verifica se a resposta realmente é JSON
        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text(); // captura HTML de erro (ex: 404 page)
          console.error("❌ Resposta inesperada do backend ao buscar categorias:", text);
          return;
        }
  
        const json = await res.json();
        console.log("📦 Categorias recebidas:", json.data.categorias);
  
        if (json.data?.categorias && Array.isArray(json.data.categorias)) {
          const nomes = json.data.categorias.map((cat: { nome: string }) => cat.nome);
          setAvailableTags(nomes);
        } else {
          console.error("⚠️ Estrutura inesperada no JSON:", json);
        }
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      }
    }
  
    fetchTags();
  }, []);
  

  

  function selectTag(tag: string) {
    setPostTag(tag);
    setTagSelectorOpen(false);
  }

  // ---------------------------
  // 4) Função de Navegação
  // ---------------------------
  function goToRoute(routeName: string, path: string) {
    // Destaca no menu
    setCurrentRoute(routeName);
    // Navega
    router.push(path);
  }

  // ---------------------------
  // 5) Layout
  // ---------------------------
  return (
    <div className="bg-[#121212] min-h-screen text-white flex">
      {/* Barra de Navegação Lateral (igual NewHome) */}
      <aside className="hidden sm:flex flex-col w-60 bg-[#1a1a1a] p-4">
        <div className="flex items-center mb-8">
          <img src="/images/logotipo.png" alt="LearnConnect Logo" className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold text-[#5c64f4]">LearnConnect</span>
        </div>
        <nav className="flex flex-col gap-4">
          {/* Exemplo: Home -> "/" */}
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

          {/* Popular -> "/popular" (exemplo) */}
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

          {/* Explore -> "/explore" */}
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

          {/* Communities -> "/communities" */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("discord", "/discord");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "discord"
                ? "text-[#5c64f4]"
                : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/comunidades.png" alt="Discord" className="w-5 h-5" />
            <span>Discord</span>
          </a>

          {/* Topics -> "/topics" */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToRoute("topicos", "/topicos");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "topicos" ? "text-[#5c64f4]" : "hover:text-[#5c64f4]"
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
      <div className="flex-1 flex flex-col p-4">
        {/* Barra Superior (igual NewHome) */}
        <header className="flex items-center justify-between bg-[#1a1a1a] p-3 sm:p-4 mb-6">
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full rounded-full bg-[#121212] text-white px-4 py-2 pl-10 focus:outline-none"
              />
              <img
                src="/images/search.png"
                alt="Search Icon"
                className="absolute w-5 h-5 top-2.5 left-3"
              />
            </div>
          </div>

          {!isLoggedIn ? (
            <button
              className="bg-[#5c64f4] text-white px-4 py-2 rounded-full hover:opacity-90"
              onClick={handleLogin}
            >
              Entrar
            </button>
          ) : (
            <div className="flex items-center gap-4">
              {/* Botão Criar: aqui podemos deixar inativo, pois já estamos em create */}
              <button className="flex items-center gap-1 bg-[#2a2a2a] border border-[#5c64f4] rounded-full px-4 py-2 cursor-not-allowed opacity-50">
                <img src="/images/criar.png" alt="Criar" className="w-5 h-5" />
                <span>Criar</span>
              </button>

              <button className="relative">
                <img src="/images/notificacoes.png" alt="Notificações" className="w-6 h-6" />
              </button>

              <div className="relative" ref={profileMenuRef}>
                <img
                  src={userAvatarUrl}
                  alt="Perfil"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                />
                {profileMenuOpen && (
  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-[0_0_10px_#5c64f4] transition-all duration-300">
    <ul className="py-2 text-sm">
      <li
        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
        onClick={() => router.push("/myposts")}
      >
        <img src="/images/myposts.png" alt="Minhas postagens" className="w-4 h-4" />
        Minhas postagens
      </li>
      <li
        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
        onClick={() => router.push("/settings")}
      >
        <img src="/images/Config.png" alt="Configurações" className="w-4 h-4" />
        Configurações
      </li>
      <li
        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2 text-red-400"
        onClick={handleLogout}
      >
        <img src="/images/logoff.png" alt="Sair" className="w-4 h-4" />
        Sair
      </li>
    </ul>
  </div>
)}

              </div>
            </div>
          )}
        </header>

        {/* Conteúdo da tela "Create post" */}
        <div className="max-w-3xl mx-auto flex-1 flex flex-col">
          {/* Título e Drafts */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Create post</h1>
            
          </div>

          {/* Abas */}
          <nav className="flex gap-6 mb-6 border-b border-gray-700">
            <button
              className={`pb-2 ${
                activeTab === "text"
                  ? "text-white border-b-2 border-[#5c64f4]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Texto
            </button>
            <button
              className={`pb-2 ${
                activeTab === "images"
                  ? "text-white border-b-2 border-[#5c64f4]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("images")}
            >
              Imagens
            </button>
            
          </nav>

          {/* Formulário */}
          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">
              Titulo<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white"
              placeholder="Título"
              maxLength={300}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="text-right text-gray-400 text-xs">
              {title.length}/300
            </div>
          </div>

          {/* Selecionar Tag (obrigatória) */}
          <div className="mb-4 relative">
            <button
              className="bg-[#2a2a2a] hover:bg-[#333] text-sm py-1 px-3 rounded"
              onClick={() => setTagSelectorOpen(!tagSelectorOpen)}
            >
              {postTag ? `Tag: ${postTag}` : "Adicionar Tag"}
            </button>
            {tagSelectorOpen && (
              <div className="absolute top-12 left-0 w-64 bg-[#1a1a1a] border border-gray-600 p-4 rounded shadow-lg z-10">
                <label className="block text-sm text-gray-300 mb-1">
                  Pesquisar Tag:
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121212] p-2 rounded focus:outline-none text-white mb-2"
                  placeholder="Search"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                />
                <p className="text-sm text-gray-400 mb-1">Mais usadas:</p>
                <div className="flex flex-col gap-1">
                {availableTags
  .filter((tg) =>
    tg.toLowerCase().includes(tagSearch.toLowerCase())
  )
  .map((tg) => (
    <button
      key={tg}
      className="bg-[#2a2a2a] hover:bg-[#333] text-left text-sm px-3 py-1 rounded"
      onClick={() => selectTag(tg)}
    >
      {tg}
    </button>
))}


                </div>
              </div>
            )}
          </div>

          {activeTab === "text" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Conteudo</label>
              <textarea
                className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white h-32"
                placeholder="Escreva seu texto..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="text-right text-sm text-gray-400 mt-1">
                
              </div>
            </div>
          )}

{activeTab === "images" && (
  <div className="mb-4">
    <label className="block text-sm text-gray-300 mb-1">URL da imagem</label>
    <input
      type="text"
      className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white"
      placeholder="Cole a URL da imagem (https://...)"
      value={thumbnailPreview || ""}
      onChange={(e) => setThumbnailPreview(e.target.value)}
    />
    {thumbnailPreview && (
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-1">Preview da thumbnail:</p>
        <img
          src={thumbnailPreview}
          alt="Thumbnail Preview"
          className="max-h-48 rounded border border-gray-600"
        />
      </div>
    )}
  </div>
)}


          {/* Botões de Salvar Rascunho e Postar */}
          <div className="mt-6 flex gap-2">
            
            <button
  className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2"
  onClick={handlePost}
  disabled={isPosting}
>
  {isPosting ? (
    <>
      <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
      Enviando...
    </>
  ) : (
    "Postar"
  )}
</button>

          </div>

          {/* Rodapé */}
          <footer className="mt-auto text-center text-gray-500 text-xs pt-8 border-t border-gray-800">
            Regras LearnConnect | Política de Privacidade | Contrato de Usuário |
            LearnConnect, INC 2025, Todos os direitos reservados
          </footer>
        </div>
      </div>
    </div>
  );
}
