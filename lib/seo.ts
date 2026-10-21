import type { Metadata } from "next";
import { caminho, equivalentes, type Conteudo } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import { HREFLANG, OG_LOCALE, type Idioma } from "@/lib/i18n/tipos";
import { NOME_SITE, SITE } from "@/lib/site";

// SEO de cada página: title/description do conteúdo, canonical SEM www (metadataBase = traderbinario.com.br),
// hreflang SÓ entre os idiomas em que a página existe (padrao-idiomas.md, regra 3) + x-default = PT, Open Graph e X.

// hreflang a partir do endereço da página em cada idioma (conteúdo: equivalentes(c); páginas fixas: lib/rotas-idiomas.ts).
export function hreflang(caminhos: Partial<Record<Idioma, string>>): Record<string, string> | null {
  const existe = Object.keys(caminhos) as Idioma[];
  if (existe.length < 2) return null;
  const languages: Record<string, string> = {};
  for (const i of existe) languages[HREFLANG[i]] = caminhos[i]!;
  if (caminhos.pt) languages["x-default"] = caminhos.pt;
  return languages;
}

export function alternates(c: Conteudo): Metadata["alternates"] {
  const languages = hreflang(equivalentes(c));
  return { canonical: caminho(c.tipo, c.slug, c.idioma), ...(languages ? { languages } : {}) };
}

// Metadados das páginas fixas (ferramentas, glossário): canonical, hreflang e Open Graph no idioma.
export function metadadosFixa(caminhos: Record<Idioma, string>, idioma: Idioma, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: caminhos[idioma], languages: hreflang(caminhos)! },
    openGraph: { type: "website", locale: OG_LOCALE[idioma], url: caminhos[idioma], siteName: NOME_SITE, title, description },
    twitter: { card: "summary", title, description },
  };
}

export function metadados(c: Conteudo): Metadata {
  const url = caminho(c.tipo, c.slug, c.idioma);
  const imagem = c.capa ? [{ url: c.capa.src, width: c.capa.largura, height: c.capa.altura, alt: c.capa.alt }] : undefined;
  const ehTexto = c.tipo !== "pagina" && c.tipo !== "categoria";
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: alternates(c),
    openGraph: {
      type: ehTexto ? "article" : "website",
      locale: OG_LOCALE[c.idioma],
      url,
      siteName: NOME_SITE,
      title: c.seo.title,
      description: c.seo.description,
      ...(imagem ? { images: imagem } : {}),
      ...(ehTexto && c.atualizadoEm ? { modifiedTime: c.atualizadoEm } : {}),
      ...(ehTexto && c.publicadoEm ? { publishedTime: c.publicadoEm } : {}),
    },
    twitter: { card: imagem ? "summary_large_image" : "summary", title: c.seo.title, description: c.seo.description },
  };
}

// ---- Dados estruturados (JSON-LD) ----
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p === "/" ? "" : p}`);

export function jsonLdArtigo(c: Conteudo) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.titulo,
    description: c.seo.description,
    inLanguage: HREFLANG[c.idioma],
    mainEntityOfPage: abs(caminho(c.tipo, c.slug, c.idioma)),
    ...(c.capa ? { image: [abs(c.capa.src)] } : {}),
    ...(c.publicadoEm ? { datePublished: c.publicadoEm } : {}),
    ...(c.atualizadoEm ? { dateModified: c.atualizadoEm } : {}),
    author: { "@type": "Person", name: c.autor ?? "Cristiano Pereira", url: "https://cristianopereira.com.br" },
    publisher: { "@type": "Organization", name: NOME_SITE, url: SITE },
  };
}

export function jsonLdTrilha(c: Conteudo, idioma: Idioma) {
  const t = textos(idioma);
  const itens = [
    { nome: t.trilha.inicio, url: abs(caminho("pagina", "home", idioma)) },
    ...(c.categoria?.href ? [{ nome: c.categoria.nome, url: abs(c.categoria.href) }] : []),
    { nome: c.trilha ?? c.titulo, url: abs(caminho(c.tipo, c.slug, idioma)) },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.nome, item: it.url })),
  };
}

// Só quando a página TEM perguntas visíveis (os MESMOS textos do FAQ da tela)
export function jsonLdFaq(c: Conteudo) {
  if (!c.faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
}
