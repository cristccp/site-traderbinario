import PaginaPolitica, { metadadosPolitica } from "@/components/paginas/PaginaPolitica";

// Política curta (INGLÊS) → /en/privacy. Texto em content/paginas/privacy.en.md.
export const metadata = metadadosPolitica("en");

export default function Page() {
  return <PaginaPolitica idioma="en" />;
}
