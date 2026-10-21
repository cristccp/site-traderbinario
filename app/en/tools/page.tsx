import PaginaFerramentas, { metadadosFerramentas } from "@/components/paginas/PaginaFerramentas";

// Ferramentas (INGLÊS) → /en/tools. Página em components/paginas/PaginaFerramentas.
export const metadata = metadadosFerramentas("en");

export default function Page() {
  return <PaginaFerramentas idioma="en" />;
}
