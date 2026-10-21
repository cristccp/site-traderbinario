import PaginaFerramentas, { metadadosFerramentas } from "@/components/paginas/PaginaFerramentas";

// Ferramentas (ESPANHOL) → /es/herramientas. Página em components/paginas/PaginaFerramentas.
export const metadata = metadadosFerramentas("es");

export default function Page() {
  return <PaginaFerramentas idioma="es" />;
}
