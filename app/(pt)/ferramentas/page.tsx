import PaginaFerramentas, { metadadosFerramentas } from "@/components/paginas/PaginaFerramentas";

// Ferramentas (PORTUGUÊS) → /ferramentas. Página em components/paginas/PaginaFerramentas.
export const metadata = metadadosFerramentas("pt");

export default function Page() {
  return <PaginaFerramentas idioma="pt" />;
}
