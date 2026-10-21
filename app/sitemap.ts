import type { MetadataRoute } from "next";
import { caminho, idiomasDisponiveis, listar, type Tipo } from "@/lib/conteudo";
import { HREFLANG, IDIOMAS } from "@/lib/i18n/tipos";
import { SITE } from "@/lib/site";

// /sitemap.xml gerado da camada de conteúdo: SÓ páginas publicadas, em cada idioma em que existem.
// hreflang (alternates) só quando a página existe em mais de um idioma (padrao-idiomas.md, regra 3).
const abs = (p: string) => (p === "/" ? SITE : SITE + p);
const TIPOS: Tipo[] = ["pagina", "guia", "categoria", "artigo", "analise"];

// Páginas fixas que não vêm de content/ (só em português por enquanto)
const FIXAS = ["/ferramentas", "/glossario"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...FIXAS.map((p) => ({ url: abs(p) })), ...TIPOS.flatMap((tipo) =>
    IDIOMAS.flatMap((idioma) =>
      listar({ tipo, idioma }).map((c) => {
        const existe = idiomasDisponiveis(tipo, c.slug);
        const languages = Object.fromEntries(existe.map((i) => [HREFLANG[i], abs(caminho(tipo, c.slug, i))]));
        return {
          url: abs(caminho(tipo, c.slug, idioma)),
          ...(c.atualizadoEm ? { lastModified: c.atualizadoEm } : {}),
          ...(existe.length > 1 ? { alternates: { languages } } : {}),
        };
      }),
    ),
  )];
}
