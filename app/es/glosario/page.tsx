import PaginaGlossario, { metadadosGlossario } from "@/components/paginas/PaginaGlossario";

// Glossário (ESPANHOL) → /es/glosario. Página em components/paginas/PaginaGlossario.
export const metadata = metadadosGlossario("es");

export default function Page() {
  return <PaginaGlossario idioma="es" />;
}
