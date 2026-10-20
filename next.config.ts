import type { NextConfig } from "next";

// Redirecionamentos das ~65 URLs antigas da Builderall (mapa de conteúdo) entram numa etapa própria, antes da virada.
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Um layout raiz por idioma (app/(pt), app/en, app/es) → um 404 único para o site todo (app/global-not-found.tsx)
  experimental: { globalNotFound: true },
};

export default nextConfig;
