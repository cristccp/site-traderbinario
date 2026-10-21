// Textos FIXOS do site (menu, rodapé, rótulos, banner), um arquivo por idioma (padrao-idiomas.md, regra 9).
// O texto de cada página (artigo, análise, home) NÃO fica aqui: fica em content/ e é lido por lib/conteudo.ts.

export type Idioma = "pt" | "en" | "es";
export const IDIOMAS: Idioma[] = ["pt", "en", "es"];
export const LANG_HTML: Record<Idioma, string> = { pt: "pt-BR", en: "en", es: "es" };
export const HREFLANG: Record<Idioma, string> = { pt: "pt-BR", en: "en", es: "es" };
export const NOME_IDIOMA: Record<Idioma, string> = { pt: "Português", en: "English", es: "Español" };   // leitor de tela do seletor
export const OG_LOCALE: Record<Idioma, string> = { pt: "pt_BR", en: "en_US", es: "es_LA" };          // es_LA: público latino

export type TextosBanner = { aria: string; texto: string; politica: string; politicaHref: string; aceitar: string; recusar: string };

export type ItemMenu = { label: string; href: string; externo?: boolean };

// Card pequeno da lateral (Trader Bots Club, Ideal Trade, e-book)
export type CardLateral = { rotulo: string; titulo: string; texto: string; href: string; acao: string };

export type Textos = {
  idioma: Idioma;
  novaAba: string;                          // leitor de tela: links que abrem em nova aba
  pularParaConteudo: string;
  marca: { nome: string; destaque: string; por: string; aria: string };
  menu: { aria: string; abrir: string; fechar: string; itens: ItemMenu[] };
  redes: { youtube: string; instagram: string };
  telegram: string;                         // botão do topo
  seletorAria: string;
  trilha: { aria: string; inicio: string };
  autor: { nome: string; linha: string; atualizado: string; por: string; bio: string; link: string; fotoAlt: string };
  artigo: { minLeitura: string; neste: string; naPratica: string; faq: string; continue: string; continueDestaque: string; capaFalta: string; risco: string };
  deriv: {
    rotulo: string; nome: string; sub: string; itens: string[]; botao: string; analise: string; risco: string;
    lateralTexto: string; lateralBotao: string; lateralRisco: string;
    fichaBotao: string; fichaRisco: string;
  };
  lateral: { aria: string; cards: CardLateral[] };
  home: { asideAria: string; corretoraAria: string; capaFalta: string };
  categoria: { rotulo: string; guia: string; textos: string; corretoras: string; quantos: string; verMais: string };
  temas: { titulo: string; destaque: string; aria: string };
  busca: { rotulo: string; campo: string; botao: string; titulo: string; destaque: string; resultados: string; um: string; nenhum: string; sugestao: string; vazio: string; carregando: string; meta: string };
  corretoras: { analise: string; cadastro: string; aviso: string };
  analise: { rotulo: string; fortes: string; atencao: string; outras: string; verTodas: string; verTodasHref: string; logoAlt: string };
  video: { play: string; aria: string };
  rodape: { risco: string; afiliado: string; corretora: string; educativo: string; copyright: string; politica: string; politicaHref: string; preferencias: string; siteCristiano: string; glossario: string };
  resumo: { titulo: string };
  ebook: { rotulo: string; botao: string; compacto: string };
  calc: {
    risco: { titulo: string; banca: string; moeda: string; pct: string; perdas: string; valorOp: string; stopDia: string; daBanca: string; perdas20: string; perdas20Nota: string; aviso: string; erroBanca: string; erroPct: string; erroPerdas: string };
    empate: { titulo: string; payout: string; resultado: string; frase: string; erroPayout: string };
  };
  ferramentas: { rotulo: string; titulo: string; destaque: string; seoTitle: string; meta: string; apoio: string; usoRisco: string; usoEmpate: string; planilha: string; planilhaLink: string; glossarioTexto: string; glossarioLink: string };
  glossario: { rotulo: string; titulo: string; destaque: string; seoTitle: string; meta: string; apoio: string; busca: string; nenhum: string; ebookTexto: string; ebookLink: string; menu: string };
  naoEncontrada: { title: string; titulo: string; destaque: string; texto: string; voltar: string };
  banner: TextosBanner;
};
