import PaginaGlossario, { metadadosGlossario } from "@/components/paginas/PaginaGlossario";

// Glossário (INGLÊS) → /en/glossary. Página em components/paginas/PaginaGlossario.
export const metadata = metadadosGlossario("en");

export default function Page() {
  return <PaginaGlossario idioma="en" />;
}
