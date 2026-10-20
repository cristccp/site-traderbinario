import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /robots.txt do domínio OFICIAL (traderbinario.com.br). Em qualquer outro endereço (vercel.app, localhost)
// o proxy.ts responde antes com "Disallow: /" (+ X-Robots-Tag: noindex) e este arquivo nem é usado.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: SITE + "/sitemap.xml",
  };
}
