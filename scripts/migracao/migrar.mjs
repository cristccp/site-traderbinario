// Migração da cópia da Builderall (../_copia) → content/*.md (1ª VERSÃO + trocas revisadas).
// Uso: node scripts/migracao/migrar.mjs <slug> [<slug> …]     (ou --lote 1)
//
// Para cada página:
//  1. lê ../_copia/<fonte>/conteudo.md e organiza a estrutura (títulos da Builderall, listas, parágrafos),
//     tira emojis, troca ícones de rede por links com texto, botões de afiliado → blocos :::corretora / :::deriv,
//     links internos antigos → endereço novo (lib de destinos abaixo), vídeo → :::video, imagens → WebP em public/;
//  2. nas análises separa prós, contras, "Principais características" (vira a ficha, escrita à mão em paginas.mjs),
//     a nota em estrelas (sai) e o 1º parágrafo (vira o apoio do título);
//  3. aplica as TROCAS revisadas à mão (trocas.mjs) — cada uma precisa achar o texto exato, senão o script para;
//  4. grava content/<pasta>/<slug>.pt.md com o frontmatter de paginas.mjs.
// O relatório de trocas do docs/revisao-conteudo.md sai de trocas.mjs (scripts/migracao/relatorio.mjs).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parse as lerYaml, stringify } from "yaml";
import { CATEGORIAS, PAGINAS, LOTES, REESCRITOS } from "./paginas.mjs";
import { TROCAS } from "./trocas.mjs";
import { destinoInterno, corretoraDoLink } from "./destinos.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const COPIA = path.join(RAIZ, "..", "_copia");
const PASTA = { artigo: "artigos", analise: "analises", guia: "guias" };

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu;
const REDES = [
  [/instagram\.com/, "Instagram"], [/youtube\.com|youtu\.be/, "YouTube"], [/whatsapp\.com|wa\.me/, "WhatsApp"],
  [/facebook\.com/, "Facebook"], [/t\.me|telegram/, "Telegram"], [/twitter\.com|x\.com/, "X (Twitter)"], [/linkedin\.com/, "LinkedIn"],
];

// 1º parágrafo de texto (meta description quando a cópia não tem uma) — só se couber em 155 caracteres
const primeiroParagrafo = (corpo) => {
  const p = corpo.split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !/^(#|-|!|:::|\[|\d+\.)/.test(x));
  const t = (p ?? "").replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  if (!t || t.length > 155) throw new Error(`description: o 1º parágrafo tem ${t.length} caracteres — escreva uma em paginas.mjs: «${t}»`);
  return t;
};
const normaliza = (x) => x.replace(/\*\*\*([^*]+?)\*\*\*/g, "**$1**").replace(EMOJI, "").replace(/(^|\s)\* +([^*\n]+?)\*(?!\*)/g, "$1*$2*").trim();
const limpaTitulo = (s) => s.replace(EMOJI, "").replace(/\*+/g, "").replace(/\s+/g, " ").trim().replace(/:$/, "");
const fraseNormal = (s) => {          // "CADASTRE-SE GRATUITAMENTE NA BINOMO!" → "Cadastre-se gratuitamente na Binomo"
  const t = limpaTitulo(s).replace(/[!]+$/, "");
  if (t !== t.toUpperCase()) return t;
  const m = t.toLowerCase();
  return (m.charAt(0).toUpperCase() + m.slice(1))
    .replace(/\b(deriv|binomo|quotex|iq option|expert option|pocket option|olymp trade|exnova|binary|ebc|ic markets|tickmill|topfx|vantage|moneta markets|metatrader)\b/gi,
      (x) => x.replace(/\b\w/g, (c) => c.toUpperCase()).replace("Iq", "IQ").replace("Ebc", "EBC").replace("Ic ", "IC ").replace("Topfx", "TopFX").replace("Metatrader", "MetaTrader"));
};

async function converterImagem(origem, destinoRel) {
  const saida = path.join(RAIZ, "public", destinoRel);
  mkdirSync(path.dirname(saida), { recursive: true });
  const info = await sharp(origem).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(saida);
  return { w: info.width, h: info.height };
}

async function migrar(cfg) {
  const fonte = path.join(COPIA, cfg.fonte ?? cfg.slug);
  const bruto = readFileSync(path.join(fonte, "conteudo.md"), "utf8").replace(/\r\n/g, "\n").replace(/⠀/g, "").replace(/[​‌⁠﻿]/g, "").replace(/ /g, " ")
    .replace(/^<!--.*?-->\n*/s, "");
  const nomeCurto = cfg.corretora?.nome ?? cfg.titulo;
  let linhas = bruto.split("\n");
  let tituloAtual = cfg.titulo;
  let nImg = 0;
  let viuTitulo = false;   // nas análises, imagem antes do 1º título = logo repetido (já está na ficha)
  let capa = null;
  let viuTexto = false;   // nas páginas fixas, imagens antes do 1º parágrafo = carrossel da Builderall (prints com % de retorno)
  const saida = [];
  const descartar = new Set((cfg.descartarImagens ?? []).map(String));

  for (let i = 0; i < linhas.length; i++) {
    let l = linhas[i].replace(/\s+$/, "");
    const semEspaco = l.trim();

    // vídeo incorporado
    let m = semEspaco.match(/^\[vídeo incorporado\]\((https?:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]+)[^)]*)\)$/);
    if (m) { saida.push("", `:::video ${m[2]}`, `Vídeo sobre a ${nomeCurto}`, ":::", ""); continue; }

    // ícone de rede social com link → link com texto
    m = semEspaco.match(/^\[!\[[^\]]*\]\([^)]*\)\]\((https?:[^)]+)\)$/);
    if (m) {
      const rede = REDES.find(([re]) => re.test(m[1]));
      saida.push(`- [${rede ? rede[1] : "Site"} da ${nomeCurto}](${m[1]})`);
      continue;
    }

    // imagem
    m = semEspaco.match(/^!\[([^\]]*)\]\(imagens\/([^)]+)\)$/);
    if (m) {
      const [, alt, arquivo] = m;
      if (descartar.has(arquivo) || /avalia[cç][aã]o/i.test(alt)) continue;          // estrelas
      if (cfg.tipo === "analise" && (!viuTitulo || alt.trim().toLowerCase() === nomeCurto.toLowerCase())) continue;   // logo repetido (já está na ficha)
      if (cfg.tipo === "guia" && !viuTexto) continue;                                    // carrossel do topo
      if (cfg.tipo === "artigo" && !capa) {                                               // 1ª imagem do artigo = capa
        const destinoCapa = `imagens/${cfg.slug}/capa.webp`;
        const med = await converterImagem(path.join(fonte, "imagens", arquivo), destinoCapa);
        capa = { src: "/" + destinoCapa, alt: cfg.capaAlt ?? `Capa do artigo “${cfg.titulo}”`, largura: med.w, altura: med.h };
        continue;
      }
      nImg++;
      const destino = `imagens/${cfg.slug}/${String(nImg).padStart(2, "0")}.webp`;
      const { w, h } = await converterImagem(path.join(fonte, "imagens", arquivo), destino);
      const altBom = alt && !/^[\w-]+$/.test(alt.replace(/\s/g, "")) || (alt && alt.includes(" ")) ? alt : `${nomeCurto}: ${tituloAtual}`;
      saida.push("", `![${altBom || nomeCurto}](/${destino} "${w}x${h}")`, "");
      continue;
    }

    // linha que é só um link: botão de afiliado, link interno ou externo
    m = semEspaco.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
    if (m) {
      const [, texto, url] = m;
      const corr = corretoraDoLink(url);
      if (corr === "deriv") { saida.push("", ":::deriv texto", fraseNormal(texto), ":::", ""); continue; }
      if (corr && cfg.semBotao) continue;                                                // sem link de cadastro confirmado
      if (corr) { saida.push("", `:::corretora ${corr}`, fraseNormal(texto), ":::", ""); continue; }
      const interno = destinoInterno(url);
      if (interno !== null) { saida.push("", `[${fraseNormal(texto)}](${interno})`, ""); continue; }
      saida.push("", `[${texto}](${url})`, "");
      continue;
    }

    // títulos da Builderall
    m = l.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      const nivel = m[1].length;
      let txt = m[2].trim();
      if (/^-\s/.test(limpaTitulo(txt))) { saida.push(limpaTitulo(txt).replace(/^-\s*/, "- ")); continue; }   // "# - item"
      if (/^\S+@\S+\.\w+$/.test(limpaTitulo(txt))) { saida.push("", `E-mail: ${limpaTitulo(txt)}`, ""); continue; }
      const marcador = txt.match(/^(?:\p{Extended_Pictographic}|[✔✓✗✘•→➡▪✅❌])️?\s*(.+)$/u);
      if (nivel === 3 && marcador) { saida.push("- " + normaliza(marcador[1])); continue; }          // "### ✔ item" = item de lista
      if (nivel === 3 && !/^\*{2,3}[^*]+\*{2,3}$/.test(txt) && limpaTitulo(txt).length > 70) {           // ### usado como corpo
        saida.push("", normaliza(txt), ""); continue;
      }
      if (nivel === 3 && limpaTitulo(txt).length <= 70 && !/^\*{2,3}/.test(txt)) { saida.push("", normaliza(txt), ""); continue; }
      const t = limpaTitulo(txt);
      if (!t) continue;
      if (t.length > 110) { saida.push("", normaliza(txt), ""); continue; }                    // parágrafo em "#"
      tituloAtual = t;
      viuTitulo = true;
      saida.push("", `${nivel <= 2 ? "##" : "###"} ${t}`, "");
      continue;
    }

    // linha que é só negrito curto ("**Conta Ouro**", "**Tipos de Gráficos Disponíveis:**") = subtítulo ###
    m = semEspaco.match(/^\*{2,3}([^*]{3,90}?)\*{2,3}(:)?$/);
    if (m) {
      const t = limpaTitulo(m[1]);
      if (t) { saida.push("", `### ${t}`, ""); continue; }
    }

    // linhas de lista/numeração com espaço na frente; rótulos ***X:***; quebras "  "
    l = l.replace(/^\s+-\s+/, "- ").replace(/^\s+(\d+)\.\s+/, "$1. ").replace(/\*\*\*([^*]+?)\*\*\*/g, "**$1**");
    l = l.replace(/^\*\*-\s+/, "- **").replace(EMOJI, "").replace(/^(\s*[-*]\s*)\s+/, "$1").replace(/ {2,}/g, " ");
    l = l.replace(/^-(?=[^\s-])/, "- ").replace(/^ (?=\S)/, "");                     // "-Item" → "- Item"; " Texto" → "Texto"
    l = l.replace(/(^|\s)\* +([^*\n]+?)\*(?!\*)/g, "$1*$2*");                         // "* 💡Dica:*" sem o emoji → "*Dica:*" (não vira lista)
    if (l.trim()) viuTexto = true;
    saida.push(l);
  }

  // links inline: internos → endereço novo; afiliados → só o texto (o botão fica no bloco)
  let corpo = saida.join("\n").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (x, texto, url) => {
    if (corretoraDoLink(url)) return texto;
    const interno = destinoInterno(url);
    return interno !== null ? `[${texto}](${interno})` : x;
  });
  corpo = corpo.replace(/\n{3,}/g, "\n\n").trim();
  for (let k = 0; k < 3; k++) corpo = corpo.replace(/^((?:- |\d+\. ).*)\n\n(?=(?:- |\d+\. ))/gm, "$1\n");   // listas sem linha em branco

  // Trecho inteiro trocado por outro (ex.: a lista de corretoras vira o bloco :::corretoras) — paginas.mjs: substituirSecao
  for (const t of cfg.substituirSecao ?? []) {
    const i = corpo.indexOf(t.de), j = corpo.indexOf(t.ate, i + 1);
    if (i < 0 || j < 0) throw new Error(`[${cfg.slug}] substituirSecao não achou «${t.de}» … «${t.ate}»`);
    corpo = corpo.slice(0, i) + t.por + "\n\n" + corpo.slice(j);
  }

  // Páginas fixas: o 1º "## …" repetia o título (o H1 já mostra)
  if (cfg.tipo === "guia" || cfg.tipo === "artigo") corpo = corpo.replace(/^## [^\n]*\n+/, "");

  // Análises: separa prós, contras, características e o 1º parágrafo
  const extra = {};
  const secao = (nomeRe) => {
    const re = new RegExp(`^#{2,3} (${nomeRe})\\s*\\n([\\s\\S]*?)(?=^#{2,3} |(?![\\s\\S]))`, "m");
    const mm = corpo.match(re);
    if (!mm) return null;
    corpo = corpo.replace(mm[0], "");
    return mm[2].trim();
  };
  const itens = (txt) => (txt ?? "").split("\n").map((x) => x.trim()).filter((x) => x.startsWith("- ")).map((x) => x.slice(2).replace(/\*\*/g, "").trim());
  if (cfg.tipo === "analise") {
    extra.pros = itens(secao("Prós"));
    extra.contras = itens(secao("Contras"));
    secao("Principais Características");
    secao("Avaliação [^\\n]*");
    const p1 = corpo.match(/^(?!#|-|!|:::|\[)(.{80,})$/m);
    if (p1) { extra.resumo = p1[1].trim(); corpo = corpo.replace(p1[0], ""); }
  }
  // FAQ: a cópia só tem as respostas → as perguntas ficam em paginas.mjs (faqPerguntas), na mesma ordem
  if (cfg.faqPerguntas) {
    const txt = secao("Perguntas Frequentes[^\\n]*");
    if (txt === null) throw new Error(`[${cfg.slug}] sem seção de perguntas frequentes`);
    const resp = txt.split(/\n\s*\n/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
    if (resp.length !== cfg.faqPerguntas.length)
      throw new Error(`[${cfg.slug}] ${resp.length} respostas × ${cfg.faqPerguntas.length} perguntas:\n` + resp.map((x, i) => `${i + 1}. ${x.slice(0, 100)}`).join("\n"));
    extra.faq = cfg.faqPerguntas.map((p, i) => ({ p, r: resp[i] }));
  }
  corpo = corpo.replace(/\n{3,}/g, "\n\n").trim();

  // Guia e análise não ganham capa da cópia: a capa vem do kit (blog/capas). Se o arquivo já tem uma, ela é mantida
  // (senão rodar a migração de novo apagaria a capa — e a limpeza de imagens abaixo apagaria o capa.webp).
  const destino = path.join(RAIZ, "content", PASTA[cfg.tipo], `${cfg.slug}.pt.md`);
  if (!capa && (cfg.tipo === "guia" || cfg.tipo === "analise") && existsSync(destino)) {
    const fmAtual = readFileSync(destino, "utf8").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
    capa = fmAtual ? lerYaml(fmAtual[1])?.capa ?? null : null;
  }

  // Frontmatter
  const cat = CATEGORIAS[cfg.categoria];
  const fm = {
    tipo: cfg.tipo, idioma: "pt", slug: cfg.slug, status: "publicado",
    titulo: cfg.titulo, ...(cfg.tituloDestaque ? { tituloDestaque: cfg.tituloDestaque } : {}),
    ...(cfg.resumo ?? extra.resumo ? { resumo: cfg.resumo ?? extra.resumo } : {}),
    seo: { title: cfg.seo.title, description: cfg.seo.description || primeiroParagrafo(corpo) },
    ...(capa ? { capa } : {}),
    categoria: { nome: cat.nome, href: cat.href },
    trilha: cfg.trilha ?? cfg.titulo,
    autor: "Cristiano Pereira", publicadoEm: null, atualizadoEm: "2026-10-20",
    ...(cfg.corretora ? { corretora: cfg.corretora } : {}),
    ...(cfg.ficha ? { ficha: cfg.ficha } : {}),
    ...(extra.pros?.length ? { pros: extra.pros } : {}),
    ...(extra.contras?.length ? { contras: extra.contras } : {}),
    ...(cfg.outras ? { outras: cfg.outras } : {}),
    ...(cfg.relacionados ? { relacionados: cfg.relacionados } : {}),
    ...(cfg.faq ?? extra.faq ? { faq: cfg.faq ?? extra.faq } : {}),
  };
  let texto = `---\n# Texto: cópia da Builderall (../_copia/${cfg.fonte ?? cfg.slug}, 20/10/2026) + trocas de docs/revisao-conteudo.md.\n# Gerado por scripts/migracao/migrar.mjs — mude o texto em trocas.mjs/paginas.mjs e rode de novo.\n${stringify(fm, { lineWidth: 0 })}---\n\n${cfg.antes ? cfg.antes + "\n\n" : ""}${corpo}\n${cfg.depois ? "\n" + cfg.depois + "\n" : ""}`;

  // Trocas revisadas à mão (cada uma tem de achar o texto exato)
  for (const t of TROCAS.filter((x) => x.pagina === cfg.slug)) {
    if (!texto.includes(t.antes)) throw new Error(`[${cfg.slug}] troca não achou o texto: «${t.antes.slice(0, 80)}»`);
    texto = texto.split(t.antes).join(t.depois);
  }
  const resto = texto.match(/(1sh\.co|bit\.ly\/TraderBinarioIQ|track\.deriv\.com|iqbroker\.com)/);
  if (resto) throw new Error(`[${cfg.slug}] sobrou link antigo: ${resto[0]}`);

  // Imagens convertidas que não ficaram no texto final (ex.: logos da lista trocada por :::corretoras) saem de public/
  const pastaImg = path.join(RAIZ, "public", "imagens", cfg.slug);
  if (existsSync(pastaImg)) {
    for (const f of readdirSync(pastaImg)) {
      if (!texto.includes(`/imagens/${cfg.slug}/${f}`)) { rmSync(path.join(pastaImg, f)); nImg--; }
    }
  }

  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, texto, "utf8");
  console.log(`ok  ${cfg.tipo.padEnd(7)} ${cfg.slug}  (${nImg} imagens)`);
}

const args = process.argv.slice(2);
const slugs = args[0] === "--lote" ? LOTES[args[1]] : args;
if (!slugs?.length) { console.log("Uso: node scripts/migracao/migrar.mjs <slug…> | --lote <n>"); process.exit(1); }
for (const s of slugs) {
  if (REESCRITOS.includes(s)) { console.log(`pulado: reescrito à mão  ${s}`); continue; }   // não sobrescreve a reescrita aprovada
  const cfg = PAGINAS[s];
  if (!cfg) throw new Error(`Sem configuração em paginas.mjs: ${s}`);
  if (!existsSync(path.join(COPIA, cfg.fonte ?? s))) throw new Error(`Sem cópia: ${s}`);
  await migrar({ slug: s, ...cfg });
}
