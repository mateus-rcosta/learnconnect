import { useState, useRef, MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";


export default function SettingsPage() {
  // -------------------------
  // Estados Globais
  // -------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Exemplo: assumimos logado
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showGeneroModal, setShowGeneroModal] = useState(false);


  // A aba atual: "conta" ou "perfil"
  type TabType = "conta" | "perfil";
  const [activeTab, setActiveTab] = useState<TabType>("conta");

  // Controla a rota atual no menu lateral
  const [currentRoute, setCurrentRoute] = useState("settings");
  const router = useRouter();

  // -------------------------
  // Funções Globais
  // -------------------------
  function handleLogout() {
    setIsLoggedIn(false);
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(e.target as Node)
    ) {
      setProfileMenuOpen(false);
    }
  }

  function goToRoute(routeName: string, path: string) {
    setCurrentRoute(routeName);
    router.push(path);
  }

  // -------------------------
  // Modal para trocar senha
  // -------------------------
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handlePasswordChange() {
    const token = localStorage.getItem("token");
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("As senhas são diferentes. Por favor, repita a nova senha.");
      return;
    }
  
    try {
      const res = await fetch(`${apiUrl}/api/settings/atualiza-senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual: currentPassword,
          novaSenha: newPassword,
        }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        toast.success("Senha alterada com sucesso!");
        setShowChangePasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        if (json.message) {
          toast.error(json.message);
        } else {
          toast.error("Erro ao trocar senha.");
        }
        
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de rede ao tentar trocar a senha");
    }
  }

  async function handleDeleteAccount() {
    const token = localStorage.getItem("token");
  
    if (!deletePassword) {
      toast.error("Digite sua senha para confirmar.");
      return;
    }
  
    try {
      const res = await fetch(`${apiUrl}/api/settings/deleta-conta`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senha: deletePassword }),
      });
  
      const json = await res.json();
  
      if (res.ok) {
        toast.success("Conta excluída com sucesso!");
        localStorage.clear();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        if (json.message) {
          toast.error(json.message);
        } else {
          toast.error("Erro ao excluir conta.");
        }
        
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de rede ao excluir conta.");
    }
  }
  
  

  // -------------------------------------------------
  // 1) ABA DE CONTA
  // -------------------------------------------------
  function AccountTab() {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Configurações</h2>
        <div className="mt-4">
          {/* Sessão "Geral" */}
          <div className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
            Geral
          </div>
          <div className="mb-6 ml-4 text-sm text-gray-400">
          <p className="mb-2">
  <strong>Endereço de e-mail</strong>: {userData.email || "Não informado"}{" "}
  <button
    className="text-[#5c64f4] ml-2 hover:underline"
    onClick={() => setShowEmailModal(true)}
  >
    {">"}
  </button>
</p>
<p>
  <strong>Gênero</strong>: {userData.genero || "Não informado"}{" "}
  <button
    className="text-[#5c64f4] ml-2 hover:underline"
    onClick={() => setShowGeneroModal(true)}
  >
    {">"}
  </button>
</p>

          </div>

          {/* Sessão "Autorização de Conta" */}
          <div className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
            Autorização de Conta
          </div>
          <div className="ml-4 text-sm text-gray-400 mb-6">
            <p className="mb-2">
              <strong>Google</strong>: Conecte sua conta Google e facilite a
              postagem de materiais com o Google Drive!
            </p>
            <button className="bg-[#2a2a2a] px-3 py-1 rounded mr-4">
              Desconectar
            </button>
            <button className="bg-[#5c64f4] px-3 py-1 rounded text-white hover:shadow-[0_0_10px_#5c64f4] transition">
              Conectar
            </button>

            <p className="mb-2 mt-4">
              <strong>Discord</strong>: Conecte sua conta Discord e obtenha
              badges incríveis (iguais aos seus cargos no servidor)!
            </p>
            <button className="bg-[#2a2a2a] px-3 py-1 rounded mr-4">
              Desconectar
            </button>
            <button className="bg-[#5c64f4] px-3 py-1 rounded text-white hover:shadow-[0_0_10px_#5c64f4] transition">
              Conectar
            </button>

            <p className="mt-4">
              <strong>Autenticação de Dois Fatores</strong>:{" "}
              <span className="text-[#5c64f4] cursor-pointer hover:underline">
                Perdeu acesso ao seu app de autenticação? Acesse seus códigos de
                backup
              </span>
            </p>
          </div>

          {/* ANTES ERA "Assinaturas" → AGORA "Segurança" */}
          <div className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
            Segurança
          </div>
          <div
            className="ml-4 text-sm text-[#5c64f4] mb-6 cursor-pointer hover:underline"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Trocar senha
          </div>

          {/* Sessão "Avançado" (Mantida) */}
          <div className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
            Avançado
          </div>
          <div className="ml-4 text-sm text-[#5c64f4] cursor-pointer hover:underline" 
          onClick={() => setShowDeleteAccountModal(true)}>
            Excluir conta
          </div>
        </div>
      </div>
    );
  }
     const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://168.75.74.153:3000";
     const [userData, setUserData] = useState({
        nome: "",              // apelido (display público)
        apelido: "",           // nome de usuário (fixo, com "@")
        bio: "",               // descrição do perfil
        avatarUrl: "/images/standard_icon.png",
        bannerUrl: "",
        email: "",
        genero: "",
      });
      

     async function checkAuthStatus() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
    
      try {
        const res = await fetch(`${apiUrl}/api/usuarios/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const json = await res.json();
        if (res.ok && json.data) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsLoggedIn(false);
      }
    }
    

     async function fetchUserProfileData() {
      const token = localStorage.getItem("token");
      console.log("🔑 Token atual:", token);
      if (!token) return;
    
      try {
        const res = await fetch(`${apiUrl}/api/usuarios/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const json = await res.json();
        console.log("🔎 Dados recebidos do backend:", json);
        if (res.ok && json.data) {
          setUserData({
            nome: json.data.nome || "",        // apelido visível
            apelido: json.data.apelido || "",  // @nomeDeUsuario
            bio: json.data.bio || "",
            avatarUrl: json.data.avatar_url || "/images/standard_icon.png",
            bannerUrl: json.data.banner_url || "",
            email: json.data.email || "",
            genero: json.data.genero || "",
          });
          
          
          
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    }
    useEffect(() => {
      checkAuthStatus();
      fetchUserProfileData();
    }, []);
    

    // Atualiza campo específico do perfil (nome ou descrição)
    async function updateUserField(
      field: "nome" | "apelido" | "bio" | "email" | "genero" | "banner_url" | "avatar_url",
      value: string
    )     {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Você precisa estar logado.");
        return;
      }
    
      // Define a rota apropriada
      let endpoint = "/api/settings/atualiza-perfil"; // padrão
    
      if (field === "avatar_url") {
        endpoint = "/api/settings/atualiza-avatar";
      } else if (field === "banner_url") {
        endpoint = "/api/settings/atualiza-banner";
      }
    
      // Monta o corpo da requisição baseado no campo
      const body: any = {};
      if (field === "nome") body.nome = value;
      else if (field === "bio") body.bio = value;
      else if (field === "avatar_url") body.avatar_url = value;
      else if (field === "banner_url") body.banner_url = value;
      else if (field === "email") body.email = value;
      else if (field === "genero") body.genero = value;
      else if (field === "apelido") body.apelido = value;

    
      try {
        const res = await fetch(`${apiUrl}${endpoint}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
    
        const json = await res.json();
    
        if (res.ok) {
          toast.success("Alteração salva com sucesso!");
    
          setUserData((prev) => ({
            ...prev,
            ...(field === "nome" && { nome: value }),
            ...(field === "bio" && { bio: value }),
            ...(field === "banner_url" && { bannerUrl: value }),
            ...(field === "avatar_url" && { avatarUrl: value }),
            ...(field === "email" && { email: value }),
            ...(field === "genero" && { genero: value }),
            ...(field === "apelido" && { apelido: value }),
            
          }));
        } else {
          toast.error(json.message || "Erro ao atualizar o perfil.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro de rede ao atualizar o perfil.");
      }
    }
    

  // -------------------------------------------------
  // 2) ABA DE PERFIL (já existia, sem alterações)
  // -------------------------------------------------
  function ProfileTab() {
    const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showApelidoModal, setShowApelidoModal] = useState(false);

  
    return (
      <div className="mt-6 relative">
        <h2 className="text-2xl font-bold mb-4">Configurações</h2>
    
        <div className="w-full flex justify-center">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
            {/* LADO ESQUERDO: Configurações */}
            <div className="flex-1">
              <div className="border-b border-gray-700 pb-2 mb-4 text-gray-300 text-sm">
                Geral
              </div>
              <div className="ml-4 text-sm text-gray-400 mb-6">
                <p className="mb-2">
                  <strong>Nome de exibição</strong> (Alterar seu nome de exibição
                  não muda seu nome de usuário)
                  <button
                    className="text-[#5c64f4] ml-2 hover:underline"
                    onClick={() => setShowDisplayNameModal(true)}
                  >
                    {">"}
                  </button>
                </p>
                <p className="mb-2">
  <strong>Apelido (nome de usuário)</strong>
  <button
    className="text-[#5c64f4] ml-2 hover:underline"
    onClick={() => setShowApelidoModal(true)}
  >
    {">"}
  </button>
</p>

                <p className="mb-2">
                  <strong>Descrição</strong>
                  <button
                    className="text-[#5c64f4] ml-2 hover:underline"
                    onClick={() => setShowDescriptionModal(true)}
                  >
                    {">"}
                  </button>
                </p>
                <p className="mb-2">
                  <strong>Avatar</strong> (Edite seu avatar ou faça upload)
                  <button
                    className="text-[#5c64f4] ml-2 hover:underline"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    {">"}
                  </button>
                </p>
                <p className="mb-2">
                  <strong>Banner</strong> (Envie uma imagem para o fundo de perfil)
                  <button
                    className="text-[#5c64f4] ml-2 hover:underline"
                    onClick={() => setShowBannerModal(true)}
                  >
                    {">"}
                  </button>
                </p>
              </div>
            </div>
    
            {/* LADO DIREITO: Card de preview do perfil */}
            <div className="w-full lg:w-96">
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_15px_#5c64f4] ring-1 ring-[#5c64f4]/40 hover:ring-[#5c64f4]/80 transition duration-300 ease-in-out"
              >
                <div className="relative w-full h-36">
                  <img
                    src={userData.bannerUrl || "/images/standard_banner.png"}
                    alt="Banner do Perfil"
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={userData.avatarUrl || "/images/standard_icon.png"}
                    alt="Avatar"
                    className="absolute bottom-[-30px] left-4 w-16 h-16 rounded-full border-4 border-[#121212] object-cover"
                  />
                </div>
                <div className="pt-10 pb-4 px-4">
                <h3 className="text-lg font-bold">{userData.nome || "Usuário"}</h3>
<p className="text-sm text-gray-400">@{userData.apelido || "username"}</p>
<p className="text-sm text-gray-400 italic mt-2">"{userData.bio || "Sem descrição"}"</p>

    
                  <div className="mt-4">
                    <button className="text-xs bg-[#2e2e2e] text-gray-300 px-3 py-1 rounded border border-[#5c64f4] hover:shadow-[0_0_5px_#5c64f4] transition">
                      🛡️ Futuras Insígnias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        {/* Modais (inalterados) */}
        {showDisplayNameModal && (
          <DisplayNameModal
            onClose={() => setShowDisplayNameModal(false)}
            currentDisplayName={userData.nome}
          />
        )}
        {showDescriptionModal && (
          <DescriptionModal
            onClose={() => setShowDescriptionModal(false)}
            currentDescription={userData.bio}
          />
        )}
        {showAvatarModal && (
          <AvatarModal
            onClose={() => setShowAvatarModal(false)}
            currentAvatarUrl={userData.avatarUrl}
          />
        )}
        {showBannerModal && (
          <BannerModal
            onClose={() => setShowBannerModal(false)}
            currentBannerUrl={userData.bannerUrl}
          />
        )}
        {showEmailModal && (
          <EmailModal
            onClose={() => setShowEmailModal(false)}
            currentEmail={userData.email}
          />
        )}
        {showGeneroModal && (
          <GeneroModal
            onClose={() => setShowGeneroModal(false)}
            currentGenero={userData.genero}
          />
        )}
        {showApelidoModal && (
          <ApelidoModal
              onClose={() => setShowApelidoModal(false)}
              currentApelido={userData.apelido}
            />
        )}

      </div>
    );
    
  }
  

  // -------------------------------------------------
  // 3) MODAIS ESPECÍFICOS DO PERFIL
  // -------------------------------------------------
     function DisplayNameModal({
        onClose,
        currentDisplayName,
      }: {
          onClose: () => void;
          currentDisplayName: string;
        }) {
          const [displayName, setDisplayName] = useState(currentDisplayName);
  

          async function handleSave() {
            if (!displayName.trim()) {
              toast.error("Digite um nome de exibição válido.");
              return;
            }
            await updateUserField("nome", displayName.trim());
            onClose();
          }
          

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Nome de exibição</h3>
          <p className="text-sm text-gray-400 mb-2">
            Alterar seu nome de exibição não muda seu nome de usuário
          </p>
          <input
            type="text"
            maxLength={90}
            className="w-full bg-[#121212] text-white p-2 rounded mb-4"
            placeholder="Digite o novo nome de exibição..."
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function DescriptionModal({
    onClose,
    currentDescription,
  }: {
    onClose: () => void;
    currentDescription: string;
  }) {
    const [description, setDescription] = useState(currentDescription);
  

    async function handleSave() {
      if (!description.trim()) {
        toast.error("A descrição não pode estar vazia.");
        return;
      }
      await updateUserField("bio", description.trim());
      onClose();
    }
    

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-96 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Descrição do Perfil</h3>
          <p className="text-sm text-gray-400 mb-2">
            Dê uma breve descrição sobre você
          </p>
          <textarea
            maxLength={200}
            className="w-full bg-[#121212] text-white p-2 rounded mb-4 h-24"
            placeholder="Escreva algo sobre você..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ApelidoModal({
    onClose,
    currentApelido,
  }: {
    onClose: () => void;
    currentApelido: string;
  }) {
    const [apelido, setApelido] = useState(currentApelido);
  
    async function handleSave() {
      const novoApelido = apelido.trim().toLowerCase();
  
      if (!novoApelido || novoApelido.length < 3 || novoApelido.length > 32) {
        toast.error("O apelido deve ter entre 3 e 32 caracteres.");
        return;
      }
  
      const validRegex = /^[a-z0-9_]+$/;
      if (!validRegex.test(novoApelido)) {
        toast.error("Use apenas letras minúsculas, números ou underline.");
        return;
      }
  
      const result = await updateUserField("apelido", novoApelido);
      onClose();
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Alterar Apelido</h3>
          <p className="text-sm text-gray-400 mb-2">
            Seu apelido é seu nome de usuário público. Use apenas letras minúsculas, números ou underline.
          </p>
          <input
            type="text"
            maxLength={32}
            className="w-full bg-[#121212] text-white p-2 rounded mb-4"
            placeholder="Digite o novo apelido..."
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  function AvatarModal({
    onClose,
    currentAvatarUrl,
  }: {
    onClose: () => void;
    currentAvatarUrl: string;
  }) {
    const [previewUrl, setPreviewUrl] = useState<string>(currentAvatarUrl);
  
    async function handleSave() {
      if (!previewUrl.trim()) {
        toast.error("Digite a URL do avatar.");
        return;
      }
  
      await updateUserField("avatar_url", previewUrl.trim());
      toast.success("Avatar atualizado com sucesso!");
      fetchUserProfileData();
      onClose();
    }
  
    async function handleResetToDefault() {
      await updateUserField("avatar_url", "/images/standard_icon.png");
      toast.success("Avatar redefinido para padrão.");
      fetchUserProfileData();
      onClose();
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Imagem de Avatar</h3>
          <p className="text-sm text-gray-400 mb-2">
            Cole a URL de uma imagem para usar como avatar do seu perfil. Isso vai mudar futuramente. 
          </p>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cole a URL da imagem do avatar..."
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="w-full bg-[#121212] text-white p-2 rounded mb-2"
            />
  
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview do Avatar"
                  className="w-24 h-24 rounded-full border border-gray-600 object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleResetToDefault}
              className="bg-red-600 text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#f87171] transition"
            >
              Redefinir para padrão
            </button>
            <button
              onClick={handleSave}
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  

  function BannerModal({
    onClose,
    currentBannerUrl,
  }: {
    onClose: () => void;
    currentBannerUrl: string;
  }) {
    const [previewBanner, setPreviewBanner] = useState<string>(currentBannerUrl);
    
    async function handleSave() {
      if (!previewBanner.trim()) {
        toast.error("Nenhuma URL inserida.");
        return;
      }
    
      await updateUserField("banner_url", previewBanner.trim());
      onClose();
    }
    

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Imagem de Banner</h3>
          <p className="text-sm text-gray-400 mb-2">
            Envie uma nova imagem de banner para seu perfil
          </p>
          <div className="mb-4">
          <input
            type="text"
            placeholder="Cole a URL da imagem de banner..."
            value={previewBanner}
            onChange={(e) => setPreviewBanner(e.target.value)}
            className="w-full bg-[#121212] text-white p-2 rounded mb-2"
          />

          {previewBanner && (
           <div className="mb-4 flex justify-center">
              <img
              src={previewBanner}
              alt="Preview do Banner"
              className="w-full max-h-40 object-cover border border-gray-600 rounded"
              />
           </div>
          )}

          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function EmailModal({
    onClose,
    currentEmail,
  }: {
    onClose: () => void;
    currentEmail: string;
  }) {
    const [email, setEmail] = useState(currentEmail);
  
    async function handleSave() {
      if (!email.trim()) {
        toast.error("Digite um e-mail válido.");
        return;
      }
  
      await updateUserField("email", email.trim());
      onClose();
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-96 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Atualizar E-mail</h3>
          <input
            type="email"
            className="w-full bg-[#121212] text-white p-2 rounded mb-4"
            placeholder="Digite seu novo e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4]"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function GeneroModal({
    onClose,
    currentGenero,
  }: {
    onClose: () => void;
    currentGenero: string;
  }) {
    const [genero, setGenero] = useState(currentGenero);
  
    async function handleSave() {
      if (!genero.trim()) {
        toast.error("Selecione uma opção válida.");
        return;
      }
  
      await updateUserField("genero", genero.trim());
      onClose();
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Selecionar Gênero</h3>
          <select
            className="w-full bg-[#121212] text-white p-2 rounded mb-4"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não dizer">Prefiro não dizer</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4]"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }  

  // -------------------------------------------------
  // 4) RETORNO FINAL DA PÁGINA
  // -------------------------------------------------

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121212] text-white">
        <p>Você precisa estar logado para acessar essa página.</p>
      </div>
    );
  }
  return (
    <div className="bg-[#121212] min-h-screen text-white flex">
      {/* Barra Lateral (menus: Home/Popular/Explore/Discord/Topics) */}
      <aside className="hidden sm:flex flex-col w-60 bg-[#1a1a1a] p-4">
        <div className="flex items-center mb-8">
          <img
            src="/images/logotipo.png"
            alt="LearnConnect Logo"
            className="w-8 h-8 mr-2"
          />
          <span className="text-xl font-bold text-[#5c64f4]">LearnConnect</span>
        </div>

        <nav className="flex flex-col gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("home");
              router.push("/");
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
              setCurrentRoute("popular");
              router.push("/popular");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "popular"
                ? "text-[#5c64f4]"
                : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/popular.png" alt="Popular" className="w-5 h-5" />
            <span>Popular</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("explore");
              router.push("/explore");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "explore"
                ? "text-[#5c64f4]"
                : "hover:text-[#5c64f4]"
            }`}
          >
            <img src="/images/explore.png" alt="Explore" className="w-5 h-5" />
            <span>Explore</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("discord");
              router.push("/discord");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "discord"
                ? "text-[#5c64f4]"
                : "hover:text-[#5c64f4]"
            }`}
          >
            <img
              src="/images/comunidades.png"
              alt="Discord"
              className="w-5 h-5"
            />
            <span>Discord</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("topics");
              router.push("/topics");
            }}
            className={`flex items-center gap-2 transition ${
              currentRoute === "topics"
                ? "text-[#5c64f4]"
                : "hover:text-[#5c64f4]"
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col p-4">
        {/* Barra Superior */}
        <header className="flex items-center justify-between bg-[#1a1a1a] p-3 sm:p-4 mb-6">
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

          {/* Menu Superior Direito (SOMENTE: Minhas postagens e Configurações) */}
          {isLoggedIn && (
            <div className="relative" ref={profileMenuRef}>
              <img
                src={userData.avatarUrl || "/images/standard_icon.png"}
                alt="Avatar do Usuário"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/standard_icon.png"; 
                }}
              />
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-[0_0_10px_#5c64f4] transition-all duration-300">
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
                  </ul>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Menu interno: "Conta" e "Perfil" (traduzido) */}
        <div className="flex gap-6 border-b border-gray-700 mb-4">
          <button
            className={`pb-2 ${
              activeTab === "conta"
                ? "text-white border-b-2 border-[#5c64f4]"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("conta")}
          >
            Conta
          </button>
          <button
            className={`pb-2 ${
              activeTab === "perfil"
                ? "text-white border-b-2 border-[#5c64f4]"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </button>
        </div>

        {/* Seções de Conteúdo */}
        {activeTab === "conta" && (
          <div className="flex-1 text-sm text-gray-300">
            <AccountTab />
          </div>
        )}
        {activeTab === "perfil" && (
          <div className="flex-1 text-sm text-gray-300">
            <ProfileTab />
          </div>
        )}

        {/* Rodapé */}
        <footer className="mt-auto text-center text-gray-500 text-xs pt-8 border-t border-gray-800">
          Regras LearnConnect | Política de Privacidade | Contrato de Usuário |
          LearnConnect, INC 2025, Todos os direitos reservados
        </footer>
      </div>

      {/* MODAL de Trocar Senha (Surge ao clicar em "Trocar senha") */}
      
      {showChangePasswordModal && (
        
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => setShowChangePasswordModal(false)}
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold mb-4">
              Gostaria de trocar sua senha atual?
            </h3>

            {/* Campo 0: senha atual */}
            <input
             type="password"
             className="w-full bg-[#121212] text-white p-2 rounded mb-2"
             placeholder="Digite sua senha atual"
             value={currentPassword}
             onChange={(e) => setCurrentPassword(e.target.value)}
            />

            {/* Campo 1: nova senha */}
            <input
              type="password"
              className="w-full bg-[#121212] text-white p-2 rounded mb-2"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* Campo 2: repita a nova senha */}
             <input
                type="password"
                className="w-full bg-[#121212] text-white p-2 rounded mb-4"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                className="bg-[#5c64f4] text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#5c64f4] transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

{showDeleteAccountModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-[#1a1a1a] w-80 max-w-full p-6 rounded-md relative shadow-[0_0_15px_#5c64f4]">
      <button
        className="absolute top-2 right-2 text-gray-300 hover:text-white"
        onClick={() => {
          setShowDeleteAccountModal(false);
          setDeletePassword("");
        }}
      >
        ✕
      </button>

      <h3 className="text-xl font-bold mb-4">Excluir conta</h3>
      <p className="text-sm text-gray-400 mb-4">
        Digite sua senha atual para confirmar a exclusão da conta. Essa ação é
        irreversível.
      </p>

      <input
        type="password"
        className="w-full bg-[#121212] text-white p-2 rounded mb-4"
        placeholder="Digite sua senha"
        value={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
      />

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setShowDeleteAccountModal(false);
            setDeletePassword("");
          }}
          className="bg-gray-600 px-4 py-2 rounded hover:opacity-80"
        >
          Cancelar
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:shadow-[0_0_10px_#f87171] transition"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
