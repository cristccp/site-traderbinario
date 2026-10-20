import type { Metadata } from "next";
import RaizSite, { VIEWPORT } from "@/components/RaizSite";
import { NOME_SITE, SITE } from "@/lib/site";

// Layout raiz do INGLÊS (<html lang> certo já no servidor). Um layout raiz por idioma, como no forexbots;
// título, description, canonical e hreflang vêm de cada página (lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: NOME_SITE, template: "%s" },
};
export const viewport = VIEWPORT;

export default function Layout({ children }: LayoutProps<"/en">) {
  return <RaizSite idioma="en">{children}</RaizSite>;
}
