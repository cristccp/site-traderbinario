import PaginaPolitica, { metadadosPolitica } from "@/components/paginas/PaginaPolitica";

// Política curta (ESPANHOL) → /es/privacidad. Texto em content/paginas/privacidad.es.md.
export const metadata = metadadosPolitica("es");

export default function Page() {
  return <PaginaPolitica idioma="es" />;
}
