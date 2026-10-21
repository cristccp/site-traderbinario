import PaginaPolitica, { metadadosPolitica } from "@/components/paginas/PaginaPolitica";

// Política de privacidade (PORTUGUÊS, completa) → /politica-de-privacidade. Texto em content/paginas/politica-de-privacidade.pt.md.
export const metadata = metadadosPolitica("pt");

export default function Page() {
  return <PaginaPolitica idioma="pt" />;
}
