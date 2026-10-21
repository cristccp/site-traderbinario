import PaginaGlossario, { metadadosGlossario } from "@/components/paginas/PaginaGlossario";

// Glossário (PORTUGUÊS) → /glossario. Página em components/paginas/PaginaGlossario.
export const metadata = metadadosGlossario("pt");

export default function Page() {
  return <PaginaGlossario idioma="pt" />;
}
