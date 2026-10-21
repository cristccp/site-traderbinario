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
};

export default nextConfig;
