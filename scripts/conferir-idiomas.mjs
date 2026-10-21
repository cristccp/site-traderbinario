// Conferência dos IDIOMAS (rodar com o npm run dev ligado): node scripts/conferir-idiomas.mjs [http://localhost:3010]
// Padrão de idiomas (site-novo/padrao-idiomas.md, regras 2, 3, 5 e 8). Para CADA página do sitemap:
//  - <html lang> e og:locale do idioma da URL (PT na raiz, /en, /es);
//  - hreflang: canonical da própria página, x-default = PT, e RECÍPROCO (cada página apontada aponta de volta para a mesma lista);
//  - sitemap: as alternativas de cada URL são as mesmas do hreflang da página;
//  - seletor PT · EN · ES: 3 links; vai para a página equivalente ou, sem equivalente, para a home do idioma; todos respondem 200;
//  - Telegram: todo link é o grupo do idioma (lib/telegram.ts); Deriv: todo link tem rel "sponsored";
//  - links internos: só para páginas do MESMO idioma (fora o seletor; a política curta EN/ES leva à completa em PT).
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3010";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://traderbinario.com.br";
const tg = readFileSync(path.join(RAIZ, "lib", "telegram.ts"), "utf8");
const TELEGRAM = Object.fromEntries([...tg.matchAll(/(pt|en|es): "([^"]+)"/g)].map((m) => [m[1], m[2]]));
const LANG = { pt: "pt-BR", en: "en", es: "es" };
const OG = { pt: "pt_BR", en: "en_US", es: "es_LA" };
const HREFLANG = { "pt-BR": "pt", en: "en", es: "es" };
const HOME = { pt: "/", en: "/en", es: "/es" };
const idiomaDe = (p) => (p === "/en" || p.startsWith("/en/") ? "en" : p === "/es" || p.startsWith("/es/") ? "es" : "pt");
const rel = (u) => u.replace(SITE, "") || "/";

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const noSitemap = new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => {
  const loc = rel(u.match(/<loc>([^<]+)<\/loc>/)[1]);
  const alt = Object.fromEntries([...u.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], rel(m[2])]));
  return [loc, alt];
}));
const paginas = [...noSitemap.keys()];

const cache = new Map();
const baixar = async (p) => {
  if (!cache.has(p)) {
    const r = await fetch(BASE + p);
    cache.set(p, { status: r.status, html: r.status === 200 ? await r.text() : "" });
  }
  return cache.get(p);
};
const alternatesDe = (html) => Object.fromEntries([...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"\/>/g)].map((m) => [m[1], rel(m[2])]));
const igual = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

let nErros = 0;
const status = new Map();
for (const p of paginas) {
  const idioma = idiomaDe(p);
  const { status: st, html } = await baixar(p);
  const erros = [];
  if (st !== 200) erros.push(`respondeu ${st}`);
  else {
    const lang = html.match(/<html lang="([^"]+)"/)?.[1];
    if (lang !== LANG[idioma]) erros.push(`<html lang="${lang}"> (esperado ${LANG[idioma]})`);
    const og = html.match(/property="og:locale" content="([^"]+)"/)?.[1];
    if (og !== OG[idioma]) erros.push(`og:locale ${og} (esperado ${OG[idioma]})`);
    const canon = rel(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "");
    if (canon !== p) erros.push(`canonical ${canon}`);

    // hreflang
    const alt = alternatesDe(html);
    if (Object.keys(alt).length) {
      if (alt[{ pt: "pt-BR", en: "en", es: "es" }[idioma]] !== p) erros.push("hreflang não inclui a própria página");
      if (alt["pt-BR"] && alt["x-default"] !== alt["pt-BR"]) erros.push("x-default diferente da versão PT");
      for (const [h, alvo] of Object.entries(alt)) {
        if (h === "x-default" || alvo === p) continue;
        const outra = await baixar(alvo);
        if (outra.status !== 200) erros.push(`hreflang ${h} → ${alvo} respondeu ${outra.status}`);
        else if (!igual(alternatesDe(outra.html), alt)) erros.push(`hreflang não recíproco com ${alvo}`);
      }
    }
    if (!igual(noSitemap.get(p) ?? {}, alt)) erros.push("alternativas do sitemap ≠ hreflang da página");

    // seletor (topo e menu do celular)
    const navs = [...html.matchAll(/<nav class="seletor[^"]*"[^>]*>([\s\S]*?)<\/nav>/g)].map((m) => m[1]);
    if (!navs.length) erros.push("sem seletor de idioma");
    for (const nav of navs) {
      const links = Object.fromEntries([...nav.matchAll(/<a [^>]*>/g)].map(([a]) => [a.match(/hrefLang="([^"]+)"/)?.[1], a.match(/href="([^"]+)"/)?.[1]]));
      for (const i of ["pt", "en", "es"]) {
        const esperado = Object.entries(alt).find(([h]) => HREFLANG[h] === i)?.[1] ?? (i === idioma ? p : HOME[i]);
        if (links[i] !== esperado) erros.push(`seletor ${i.toUpperCase()} → ${links[i]} (esperado ${esperado})`);
        else status.set(esperado, null);
      }
    }

    // Telegram e Deriv
    for (const m of html.matchAll(/href="(https:\/\/t\.me\/[^"]+)"/g)) if (m[1] !== TELEGRAM[idioma]) erros.push(`Telegram de outro idioma: ${m[1]}`);
    for (const m of html.matchAll(/<a [^>]*href="https:\/\/t\.deriv\.link[^"]*"[^>]*>/g)) if (!/rel="[^"]*sponsored/.test(m[0])) erros.push("link da Deriv sem sponsored");

    // links internos no mesmo idioma (fora o seletor)
    const semSeletor = html.replace(/<nav class="seletor[\s\S]*?<\/nav>/g, "").replace(/<link [^>]*>/g, "");
    for (const m of semSeletor.matchAll(/href="(\/[^"#?]*)/g)) {
      const alvo = m[1].replace(/\/$/, "") || "/";
      if (alvo.startsWith("/_next") || /\.(webp|png|svg|ico|xml|txt|json|css|js)$/.test(alvo)) continue;
      if (idiomaDe(alvo) === idioma) continue;
      if (idioma !== "pt" && alvo === "/politica-de-privacidade" && /\/(privacy|privacidad)$/.test(p)) continue;
      erros.push(`link interno para outro idioma: ${alvo}`);
    }
  }
  nErros += erros.length;
  console.log(`${erros.length ? "✗" : "✓"} ${p}`);
  for (const e of [...new Set(erros)]) console.log(`  ERRO  ${e}`);
}

// Destinos do seletor (home dos idiomas e equivalentes) respondem 200
for (const alvo of status.keys()) {
  const { status: st } = await baixar(alvo);
  if (st !== 200) { console.log(`✗ seletor leva a ${alvo}, que respondeu ${st}`); nErros++; }
}

const porIdioma = paginas.reduce((n, p) => ({ ...n, [idiomaDe(p)]: (n[idiomaDe(p)] ?? 0) + 1 }), {});
console.log(`\n${paginas.length} páginas no sitemap (PT ${porIdioma.pt ?? 0} · EN ${porIdioma.en ?? 0} · ES ${porIdioma.es ?? 0}) · ${nErros} erro(s)`);
process.exit(nErros ? 1 : 0);
