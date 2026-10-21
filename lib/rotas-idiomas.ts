import type { Idioma } from "@/lib/i18n/tipos";

// Páginas FIXAS (não vêm de content/) em cada idioma — NUM LUGAR SÓ: rotas, seletor, hreflang, sitemap, menu e rodapé.
// Endereços aprovados na copy EN/ES (entregas/traderbinario-copy-en-es-2026-10-21.md, seção 2).
// Home, artigos e política vêm de content/ e se ligam pelo campo "original" (lib/conteudo.ts → equivalentes).
export const FIXAS = {
  ferramentas: { pt: "/ferramentas", en: "/en/tools", es: "/es/herramientas" },
  glossario: { pt: "/glossario", en: "/en/glossary", es: "/es/glosario" },
} satisfies Record<string, Record<Idioma, string>>;

export type PaginaFixa = keyof typeof FIXAS;
