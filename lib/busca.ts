// Busca do blog, sem servidor e sem biblioteca: o índice é gerado no build (/busca-indice.json) e a busca roda no navegador.
// Este arquivo é usado nos dois lados (montar o índice e buscar), então não importa nada do servidor.

export type ItemIndice = {
  t: string;                              // título
  r: string;                              // resumo (ou description)
  c: string;                              // categoria
  k: "artigo" | "guia" | "analise";       // tipo
  u: string;                              // endereço
  capa?: { src: string; alt: string };
  f: string;                              // palavras do FAQ (normalizadas, únicas, separadas por espaço)
  p: string;                              // palavras do corpo (idem)
};

// "Opções Binárias" → "opcoes binarias" (sem acento, minúsculas)
export const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const palavras = (s: string) => normalizar(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 2 || /\d/.test(w));   // "5" de "MetaTrader 5" conta
// Palavras muito comuns que não ajudam a achar nada (o índice fica bem mais leve sem elas)
const COMUNS = new Set(("como mais voce para isso esse essa este esta isto pela pelo pelos pelas sobre quando porque entre muito muita muitos muitas " +
  "mesmo mesma ainda sempre cada todo toda todos todas pode podem fazer sendo seja suas seus nossa nosso nunca onde qual quais depois antes aqui " +
  "assim tambem apenas cada outro outra outros outras alguns algumas quem ter tem tinha sera seria estao estar foram fica ficar vai vamos voces " +
  "dessa desse deste desta nessa nesse neste nesta numa quanto quanta exemplo forma parte coisa vezes").split(" "));
// Corpo e FAQ no índice: palavras com 4+ letras (fora as comuns), cortadas nos 8 primeiros caracteres e sem repetir
// ("operacao", "operacoes" → "operacao", "operacoe"…): o arquivo fica leve e a busca compara pelos mesmos 8 caracteres.
export const RAIZ = 8;
// minimo = quantas vezes a raiz precisa aparecer (corpo: 2, os termos de que o texto trata; FAQ: 1)
export function unicas(s: string, minimo = 1) {
  const conta = new Map<string, number>();
  for (const w of palavras(s)) if (w.length >= 4 && !COMUNS.has(w)) { const r = w.slice(0, RAIZ); conta.set(r, (conta.get(r) ?? 0) + 1); }
  return [...conta].filter(([, n]) => n >= minimo).map(([r]) => r).join(" ");
}

// Pontos por palavra buscada: título 10 (+2 no começo de uma palavra do título), resumo 4, categoria 3, FAQ 2, corpo 1;
// +5 se o título tem a frase buscada inteira e +10 para guia (a página de referência do tema).
// Todas as palavras buscadas precisam aparecer em algum campo. Resultado: do mais relevante para o menos.
export function buscarNoIndice(indice: ItemIndice[], consulta: string): ItemIndice[] {
  const termos = [...new Set(palavras(consulta))];
  if (!termos.length) return [];
  const pontuados: { item: ItemIndice; pontos: number }[] = [];
  for (const item of indice) {
    const T = " " + normalizar(item.t), R = normalizar(item.r), C = normalizar(item.c), F = " " + item.f, P = " " + item.p;
    let total = 0;
    let todos = true;
    for (const w of termos) {
      let s = 0;
      if (T.includes(w)) s += 10 + (T.includes(" " + w) ? 2 : 0);
      if (R.includes(w)) s += 4;
      if (C.includes(w)) s += 3;
      const raiz = w.slice(0, RAIZ);
      if (F.includes(" " + raiz)) s += 2;
      if (P.includes(" " + raiz)) s += 1;
      if (!s) { todos = false; break; }
      total += s;
    }
    if (!todos) continue;
    if (termos.length > 1 && T.includes(termos.join(" "))) total += 5;
    if (item.k === "guia") total += 10;
    pontuados.push({ item, pontos: total });
  }
  return pontuados.sort((a, b) => b.pontos - a.pontos || a.item.t.localeCompare(b.item.t)).map((x) => x.item);
}
