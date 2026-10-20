import type { Viewport } from "next";
import type { ReactNode } from "react";
import BannerCookies from "@/components/cookies/BannerCookies";
import ConsentimentoHead from "@/components/cookies/ConsentimentoHead";
import Rodape from "@/components/Rodape";
import { fraunces, poppins } from "@/lib/fontes";
import { textos } from "@/lib/i18n";
import { LANG_HTML, type Idioma } from "@/lib/i18n/tipos";
import "@/app/globals.css";
import "@/app/blog.css";

// O <html> do site, igual nos 3 idiomas — só muda o lang (já no HTML do servidor), o rodapé e o banner no idioma.
// Usado pelos layouts raiz app/(pt), app/en, app/es e pelo 404 (app/global-not-found.tsx). Mesmo padrão do forexbots.
// O topo fica em cada página (o seletor de idioma depende da página).
export const VIEWPORT: Viewport = { themeColor: "#07090C" };   // = --color-ink (a barra do navegador no celular)

export default function RaizSite({ idioma, children }: { idioma: Idioma; children: ReactNode }) {
  const t = textos(idioma);
  return (
    <html lang={LANG_HTML[idioma]} className={`${fraunces.variable} ${poppins.variable}`}>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* 1º: consentimento (Consent Mode v2) e, só no domínio oficial e com GTM_ID, o GTM */}
        <ConsentimentoHead />
      </head>
      <body>
        {children}
        <Rodape idioma={idioma} />
        <BannerCookies textos={t.banner} novaAba={t.novaAba} />
      </body>
    </html>
  );
}
