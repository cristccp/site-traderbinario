import type { Metadata } from "next";
import PaginaHome from "@/components/paginas/PaginaHome";
import { buscar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Home (ESPANHOL) → /es. Sem content/paginas/home.es.md publicado, dá 404.
export function generateMetadata(): Metadata {
  const c = buscar("pagina", "home", "es");
  return c ? metadados(c) : {};
}

export default function Page() {
  return <PaginaHome idioma="es" />;
}
