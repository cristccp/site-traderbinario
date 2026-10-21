import type { NextConfig } from "next";
import REDIRECIONAMENTOS from "./lib/redirecionamentos.json";

// Redirecionamentos 308 das URLs antigas da Builderall: tabela única em lib/redirecionamentos.json
// (aprovada em docs/redirecionamentos.md). permanent: true = 308.
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Um layout raiz por idioma (app/(pt), app/en, app/es) → um 404 único para o site todo (app/global-not-found.tsx)
  experimental: { globalNotFound: true },
  async redirects() {
    return REDIRECIONAMENTOS.map((r) => ({ source: r.de, destination: r.para, permanent: true }));
  },
};

export default nextConfig;
