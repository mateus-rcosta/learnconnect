import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/router";

interface SearchBarProps {
  initialValue?: string; 
  placeholder?: string;
  // Se você quiser customizar para qual rota direciona:
  searchRoute?: string; 
}

/**
 * Componente de busca genérico
 * - Usa state local para armazenar searchTerm
 * - Ao pressionar Enter ou clicar no ícone, faz o router.push() para /explore?q=...
 *   ou para searchRoute + "?q=..." se fornecido
 */
export default function SearchBar({
  initialValue = "",
  placeholder = "Search",
  searchRoute = "/explore",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  const router = useRouter();

  function handleSearch() {
    const term = searchTerm.trim();
    if (!term) return;
    // Exemplo: redireciona para /explore?q=termoDigitado
    router.push(`${searchRoute}?q=${encodeURIComponent(term)}`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full rounded-full bg-[#121212] text-white px-4 py-2 pl-10 focus:outline-none"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <img
        src="/images/search.png"
        alt="Search Icon"
        className="absolute w-5 h-5 top-2.5 left-3 cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
}
