import type { MetadataRoute } from "next";
import { caminho, equivalentes, indexavel, listar, type Tipo } from "@/lib/conteudo";
import { IDIOMAS, type Idioma } from "@/lib/i18n/tipos";
import { FIXAS } from "@/lib/rotas-idiomas";
import { hreflang } from "@/lib/seo";
import { SITE } from "@/lib/site";

// /sitemap.xml gerado da camada de conteúdo: SÓ páginas publicadas, em cada idioma em que existem.
// hreflang (alternates + x-default = PT) só entre páginas equivalentes (padrao-idiomas.md, regra 3).
const abs = (p: string) => (p === "/" ? SITE : SITE + p);
const TIPOS: Tipo[] = ["pagina", "guia", "categoria", "artigo", "analise"];

const alternates = (caminhos: Partial<Record<Idioma, string>>) => {
  const languages = hreflang(caminhos);
  return languages ? { alternates: { languages: Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, abs(v)])) } } : {};
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas fixas (não vêm de content/): ferramentas e glossário nos 3 idiomas (lib/rotas-idiomas.ts)
  const fixas = Object.values(FIXAS).flatMap((caminhos) => IDIOMAS.map((i) => ({ url: abs(caminhos[i]), ...alternates(caminhos) })));
  return [...fixas, ...TIPOS.flatMap((tipo) =>
    IDIOMAS.flatMap((idioma) =>
      // categoria EN/ES com menos de 3 conteúdos (noindex) fica fora — e fora do hreflang das outras (29/10/2026)
      listar({ tipo, idioma }).filter(indexavel).map((c) => ({
        url: abs(caminho(tipo, c.slug, idioma)),
        ...(c.atualizadoEm ? { lastModified: c.atualizadoEm } : {}),
        ...alternates(equivalentes(c, true)),
      })),
    ),
  )];
}
