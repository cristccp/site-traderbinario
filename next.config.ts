import type { NextConfig } from "next";
import REDIRECIONAMENTOS from "./lib/redirecionamentos.json";

// Redirecionamentos 308 das URLs antigas da Builderall: tabela única em lib/redirecionamentos.json
// (aprovada em docs/redirecionamentos.md). permanent: true = 308.
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Um layout raiz por idioma (app/(pt), app/en, app/es) → um 404 único para o site todo (app/global-not-found.tsx)
  experimental: { globalNotFound: true },
  // O Tutor IA lê no servidor as regras e a base (lib/tutor/*.md) e o texto da página (content/): a Vercel leva junto
  outputFileTracingIncludes: {
    "/api/tutor": ["./lib/tutor/**/*.md", "./content/**/*.md"],
  },
  async redirects() {
    return REDIRECIONAMENTOS.map((r) => ({ source: r.de, destination: r.para, permanent: true }));
  },
  // /ultimos.json?idioma=pt|en|es (faixa da home do cristianopereira.com.br) → arquivo estático do idioma (app/ultimos/[idioma]).
  // Sem ?idioma (ou outro valor) = pt. Rewrites "afterFiles": vêm antes das rotas dinâmicas, então o [slug] não pega o endereço.
  async rewrites() {
    return [
      ...(["en", "es"] as const).map((idioma) => ({
        source: "/ultimos.json", has: [{ type: "query" as const, key: "idioma", value: idioma }], destination: `/ultimos/${idioma}`,
      })),
      { source: "/ultimos.json", destination: "/ultimos/pt" },
    ];
  },
  // Lista pública: cache de 1 h e fora do Google (noindex); não entra no sitemap.
  async headers() {
    const cabecalhos = [
      { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
      { key: "X-Robots-Tag", value: "noindex" },
    ];
    return [{ source: "/ultimos.json", headers: cabecalhos }, { source: "/ultimos/:idioma", headers: cabecalhos }];
  },
};

export default nextConfig;
