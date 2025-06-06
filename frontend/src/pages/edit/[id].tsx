import { useEffect, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";

export default function EditMaterial() {
  const router = useRouter();
  const { id } = router.query;
  const [material, setMaterial] = useState<any>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postTag, setPostTag] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Navbar
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentRoute, setCurrentRoute] = useState("edit");

  useEffect(() => {
    async function fetchMaterial() {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const res = await fetch(`/api/materiais/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setMaterial(data);
          setTitle(data.titulo);
          setBody(data.conteudo);
          setPostTag(data.categoria);
          setThumbnailUrl(data.thumbnail_url);
          setThumbnailPreview(data.thumbnail_url);

          const usuarioToken = JSON.parse(atob(token.split(".")[1]));
          if (usuarioToken?.apelido === data.autor.apelido) {
            setIsAuthor(true);
          }
        } else {
          alert("Material não encontrado.");
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar material.");
      } finally {
        setLoading(false);
      }
    }

    fetchMaterial();
  }, [id]);

  async function handleSave() {
    if (!title.trim()) {
      alert("Título obrigatório");
      return;
    }
    if (!postTag) {
      alert("Tag obrigatória");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !id) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/materiais/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: title,
          descricao: body || "Sem descrição",
          categoria: postTag,
          conteudo: body,
          thumbnail_url: thumbnailPreview || "https://via.placeholder.com/300",
        }),
      });

      if (res.ok) {
        alert("Material atualizado!");
        router.push(`/post/${id}`);
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao atualizar.");
      }
    } catch (err) {
      alert("Erro inesperado.");
    } finally {
      setIsSaving(false);
    }
  }

  const popularTags = ["Programação", "Design", "Segurança"];

  if (loading) {
    return <div className="text-white p-6">Carregando material...</div>;
  }

  if (!isAuthor) {
    return <div className="text-red-400 p-6">Apenas o autor pode editar este material.</div>;
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white flex">
      {/* Sidebar (idêntico ao Create) */}
      <aside className="hidden sm:flex flex-col w-60 bg-[#1a1a1a] p-4">
        <div className="flex items-center mb-8">
          <img src="/images/logotipo.png" alt="LearnConnect Logo" className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold text-[#5c64f4]">LearnConnect</span>
        </div>
        <nav className="flex flex-col gap-4">
          <a onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer hover:text-[#5c64f4]">
            <img src="/images/home.png" className="w-5 h-5" />
            <span>Home</span>
          </a>
          <a onClick={() => router.push("/popular")} className="flex items-center gap-2 cursor-pointer hover:text-[#5c64f4]">
            <img src="/images/popular.png" className="w-5 h-5" />
            <span>Popular</span>
          </a>
          <a onClick={() => router.push("/explore")} className="flex items-center gap-2 cursor-pointer hover:text-[#5c64f4]">
            <img src="/images/explore.png" className="w-5 h-5" />
            <span>Explore</span>
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-[#1a1a1a] p-3 sm:p-4 mb-6">
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full bg-[#121212] text-white px-4 py-2 pl-10 focus:outline-none"
              />
              <img src="/images/search.png" className="absolute w-5 h-5 top-2.5 left-3" />
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="max-w-3xl mx-auto flex-1 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Editar Material</h1>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Título</label>
            <input
              type="text"
              value={title}
              maxLength={300}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Tag</label>
            <select
              className="bg-[#1a1a1a] text-white p-2 border border-gray-700 rounded w-full"
              value={postTag}
              onChange={(e) => setPostTag(e.target.value)}
            >
              <option value="">Selecione...</option>
              {popularTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Corpo</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white h-32"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Thumbnail URL</label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => {
                setThumbnailUrl(e.target.value);
                setThumbnailPreview(e.target.value);
              }}
              className="w-full bg-[#1a1a1a] border border-gray-700 p-2 rounded focus:outline-none text-white"
              placeholder="https://exemplo.com/thumb.jpg"
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-400">Preview:</p>
                <img src={thumbnailPreview} alt="Preview" className="max-h-48 border border-gray-600 rounded" />
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
            <button
              className="bg-[#2a2a2a] text-white px-4 py-2 rounded hover:bg-[#333]"
              onClick={() => router.push(`/post/${id}`)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
