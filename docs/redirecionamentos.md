# Redirecionamentos 308 — traderbinario.com.br (lote 4, 20/10/2026) — APROVADO em 20/10/2026

Tabela única: `lib/redirecionamentos.json` → `next.config.ts` (`permanent: true` = 308). **69 regras.**
Regra: toda URL antiga dá 200 (mesma URL no site novo) ou 308 para a página mais parecida que dá 200 — nunca 404.
Teste: `node scripts/testar-urls.mjs` lê `docs/inventario-builderall.txt` (131 URLs do sitemap da Builderall + 20 com visitas no GA4).
Resultado em 20/10/2026 (localhost): **151 URLs · 81 com 200 direto · 70 com 308 → 200 · 0 falha**.

## Categorias (/c/…)
- **Páginas novas com a mesma URL (6):** /c/opcoes-binarias, /c/forex, /c/robos-traders, /c/metatrader, /c/corretoras e **/c/gestao-de-risco** (nova — não existia na Builderall; é o destino do menu "Gestão de risco" até o guia existir).
- **Categorias antigas sem página → 308:** /c/-dicas (nenhum texto ficou em "Dicas"; os de posicionamento estão em Gestão de risco), /c/indicadores, /c/deriv e /c/criptomoedas — achadas no GA4 (só leitura).
- **Paginação** /c/<categoria>/page/N → /c/<categoria> (o site novo lista tudo numa página).
- Textos novos das 6 categorias (título, apoio, SEO, card do guia): `content/categorias/*.pt.md` — para aprovar.

## Builderall (páginas técnicas e home antiga) (11)
| De | Para | Por quê |
|---|---|---|
| `/tudo-sobre-opcoes-binarias-forex-trading-home` | `/` | cópia antiga da home (banner "renda no automático") |
| `/blog/tudo-sobre-opcoes-binarias-forex-trading` | `/` | cópia antiga da home |
| `/blog/post` | `/` | página técnica da Builderall |
| `/blog/feed-news` | `/` | página técnica da Builderall |
| `/blog/author` | `/` | página técnica da Builderall |
| `/feed-news` | `/` | página técnica da Builderall (174 visitas no GA4) |
| `/s` | `/` | busca da Builderall (40 visitas no GA4) |
| `/signin` | `/` | login da Builderall (16 visitas no GA4) |
| `/page/:n*` | `/` | paginação da home da Builderall (/page/1…4 com visitas no GA4) |
| `/blog` | `/` | o blog novo não tem página /blog (os artigos ficam em /blog/<slug>) |
| `/tudo-sobre-opcoes-binarias-forex-trading` | `/` | variação antiga da home (10 visitas no GA4) |

## Categorias antigas /c/… (5)
| De | Para | Por quê |
|---|---|---|
| `/c/-dicas` | `/c/gestao-de-risco` | categoria antiga; os textos de posicionamento agora estão em Gestão de risco |
| `/c/indicadores` | `/c/gestao-de-risco` | categoria antiga (24 visitas no GA4); os textos de análise técnica estão em Gestão de risco |
| `/c/deriv` | `/analise-corretora-deriv` | categoria antiga (14 visitas no GA4) |
| `/c/criptomoedas` | `https://cristianopereira.com.br` | categoria antiga (6 visitas no GA4); cripto saiu do blog (mapa: tema mora no cristianopereira.com.br) |
| `/c/:cat/page/:resto*` | `/c/:cat` | paginação das categorias da Builderall (o site novo lista tudo numa página) |

## Fora do blog (cristianopereira.com.br) (7)
| De | Para | Por quê |
|---|---|---|
| `/ebooks-gratis` | `https://cristianopereira.com.br/materiais-gratuitos` | e-books moram no site do Cristiano |
| `/acessos-premiums-trader-binario` | `https://cristianopereira.com.br/materiais-premium` | acessos premium moram no site do Cristiano |
| `/links-traderbinario` | `https://cristianopereira.com.br` | página de links → site do Cristiano |
| `/curso-gratis-opcoes-binarias-binary-para-iniciantes` | `https://cristianopereira.com.br/materiais-gratuitos` | página antiga de curso grátis (9 visitas no GA4) → materiais gratuitos |
| `/blog/halving-e-bitcoin-o-que-e-como-afeta-a-criptomoeda-mais-famosa-do-mundo` | `https://cristianopereira.com.br` | cripto saiu do blog (mapa) |
| `/blog/bitcoin-vs-altcoins-qual-criptomoeda-devo-escolher` | `https://cristianopereira.com.br` | cripto saiu do blog (mapa) |
| `/blog/introducao-as-criptomoedas-o-que-sao-como-funcionam` | `https://cristianopereira.com.br` | cripto saiu do blog (mapa) |

## Corretoras (lote 2) (3)
| De | Para | Por quê |
|---|---|---|
| `/blog/analise-plataforma-negociacao-quotex` | `/analise-corretora-quotex` | não migra no lote 2: descreve recursos que a Quotex não tem (ações, títulos, trailing stop) |
| `/blog/introducao-iq-option` | `/analise-corretora-iq-option` | não migra no lote 2: contradiz a análise (CySEC × São Vicente); duplicado da análise |
| `/blog/o-guia-completo-da-exnova-uma-visao-geral-da-plataforma-de-negociacao` | `/analise-corretora-exnova` | não migra no lote 2: descreve a Exnova como corretora de valores com títulos e fundos e "devidamente regulamentada" |

## Robôs traders (10)
| De | Para | Por quê |
|---|---|---|
| `/robos-opcoes-binarias` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | página antiga (3 visitas no GA4) → guia de robôs |
| `/blog/robo-bom-nao-e-o-que-acerta-sempre-e-o-que-sabe-parar-igual-voce-deveria` | `/blog/robo-trader-bom-nao-e-o-que-acerta-sempre-e-o-que-sabe-parar` | duplicado |
| `/blog/robos-traders-realmente-funcionam` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | mesmo tema do guia (75 visitas no GA4) |
| `/blog/como-escolher-um-robo-trader-confiavel` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | fundido no guia (mapa) |
| `/blog/robo-trader-vale-a-pena` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | fundido no guia (mapa) |
| `/blog/robos-traders-e-inteligencia-artificial-ganhe-tempo-e-lucre-no-automatico` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | título com promessa ("lucre no automático") — sai (mapa) |
| `/blog/negociacao-automatizada-em-opcoes-binarias-pros-e-contras-dos-robos-de-negociacao` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | fundido no guia (mapa) |
| `/blog/vantagens-desvantagens-dos-robos-traders-automatizando-investimentos` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | fundido no guia (mapa) |
| `/blog/introducao-robos-traders-automatizando-futuro-investimentos` | `/blog/robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados` | fundido no guia (mapa) |
| `/blog/estrategias-de-negociacao-com-robos-traders-na-deriv` | `/blog/introducao-robos-traders-deriv-investimento-automatizado` | mesmo tema (robôs na Deriv) |

## MetaTrader (5)
| De | Para | Por quê |
|---|---|---|
| `/blog/introducao-metatrader-guia-iniciantes` | `/blog/metatrader-5-mt5-guia-completo` | duplicado do guia |
| `/blog/como-instalar-o-metatrader-guia-passo-a-passo-sistemas-operacionais` | `/blog/como-instalar-metatrader-no-pc-passo-a-passo` | duplicado |
| `/blog/configuracao-graficos-metatrader-um-tutorial-detalhado-analise-tecnica` | `/blog/como-usar-o-metatrader-pela-primeira-vez` | mesmo tema |
| `/blog/como-desenvolver-um-expert-advisor-no-metatrader-um-guia-passo-a-passo` | `/blog/o-que-e-um-ea-expert-advisor-no-metatrader` | mesmo tema (11 visitas no GA4) |
| `/blog/introducao-expert-advisors-metatrader` | `/blog/o-que-e-um-ea-expert-advisor-no-metatrader` | duplicado |

## Forex (6)
| De | Para | Por quê |
|---|---|---|
| `/blog/quanto-da-para-ganhar-no-forex-a-verdade-que-poucos-contam` | `/blog/forex-o-que-e-como-funciona-guia-completo-para-iniciantes` | tema de promessa → guia de forex (mapa) |
| `/blog/introducao-ao-mercado-forex` | `/blog/forex-o-que-e-como-funciona-guia-completo-para-iniciantes` | duplicado do guia |
| `/blog/analise-tecnica-analise-fundamental-forex` | `/blog/os-indicadores-mais-usados-no-forex-e-como-utilizar-cada-um` | mesmo tema |
| `/blog/o-papel-da-alavancagem-no-day-trade-amplificacao-de-ganhos-e-perdas` | `/blog/alavancagem-no-forex-o-que-e-como-funciona-e-como-usar-com-seguranca` | mesmo tema |
| `/blog/ichimoku-cloud-simplificando-a-analise-tecnica-para-traders` | `/blog/os-indicadores-mais-usados-no-forex-e-como-utilizar-cada-um` | o artigo de indicadores explica o Ichimoku |
| `/blog/osciladores-no-day-trade-stochastic-williams-r-e-mais` | `/blog/os-indicadores-mais-usados-no-forex-e-como-utilizar-cada-um` | o artigo de indicadores explica o Estocástico |

## Gestão de risco e análise técnica (6)
| De | Para | Por quê |
|---|---|---|
| `/a/cristiano-pereira` | `/c/gestao-de-risco` | página de autor da Builderall; /c/-dicas agora redireciona para Gestão de risco (evita 2 saltos) |
| `/blog/quanto-e-possivel-ganhar-com-day-trade-expectativas-versus-realidade` | `/c/gestao-de-risco` | não migra no lote 3: promessa de ganho em números ("2% a 5% ao mês", R$ 170/dia) e custos da B3 — reescrever com "expectativa × realidade" sem números (mapa, tema 5); vai para o guia de gestão de risco quando existir |
| `/e-possivel-viver-opcoes-binarias` | `/blog/voce-nao-vive-de-lucro-voce-vive-de-constancia` | promessa no tema ("viver de") → o artigo mais parecido, sem promessa |
| `/blog/psicologia-no-trading-de-op-es-bin-rias-o-fator-que-decide-se-voc-ganha-ou-perde` | `/blog/os-5-sinais-claros-de-que-voce-esta-operando-por-impulso-e-colocando-sua-banca-em-risco` | mesmo tema (emocional), texto antigo |
| `/blog/o-guia-completo-para-iniciantes-sobre-rsi-no-day-trade` | `/blog/rsi-desvendado-como-utilizar-o-indice-de-for-a-relativa-no-day-trade` | 2 de RSI → 1 (mapa) |
| `/blog/estrategias-populares-no-day-trade-uma-visao-geral-completa` | `/c/gestao-de-risco` | artigo genérico antigo → categoria do tema |

## Investimentos (2)
| De | Para | Por quê |
|---|---|---|
| `/blog/investir-e-so-para-ricos-descubra-a-verdade-e-comece-com-pouco-dinheiro` | `/blog/por-que-todo-trader-deveria-investir` | mesmo tema, dentro do blog |
| `/blog/5-erros-comuns-ao-investir-e-como-evita-los` | `/blog/por-que-todo-trader-deveria-investir` | mesmo tema, dentro do blog |

## Opções binárias (14)
| De | Para | Por quê |
|---|---|---|
| `/opcoes-binarias-legalizado-brasil` | `/o-que-sao-opcoes-binarias` | não migra no lote 1: base legal desatualizada (Res. CMN 3.265/05) → reescrever no lote |
| `/opcoes-binarias-seguro` | `/o-que-sao-opcoes-binarias` | fusão com "é legalizado?", que também não migra → reescrever no lote |
| `/blog/opcoes-binarias-e-seguro` | `/o-que-sao-opcoes-binarias` | duplicado de "é seguro?" → reescrever no lote |
| `/como-funcionam-as-opcoes-binarias` | `/o-que-sao-opcoes-binarias` | não migra no lote 1: "aposta" e promessa de lucro em todo o texto → reescrever no lote |
| `/ativos-financeiros-opcoes-binarias` | `/o-que-sao-opcoes-binarias` | não migra no lote 1: tradução ruim com promessa de rentabilidade → reescrever no lote |
| `/opcoes-binarias-e-fraude` | `/blog/riscos-das-opcoes-binarias-o-que-poucos-falam-e-como-reduzir` | artigo genérico antigo → o mais parecido |
| `/blog/o-que-sao-opcoes-binarias` | `/o-que-sao-opcoes-binarias` | duplicado do guia |
| `/blog/opcoes-binarias-o-que-sao-como-funcionam-e-se-ainda-valem-a-pena` | `/o-que-sao-opcoes-binarias` | duplicado do guia (36 visitas no GA4) |
| `/blog/tendencias-e-futuro-das-opcoes-binarias` | `/o-que-sao-opcoes-binarias` | artigo genérico antigo → guia |
| `/blog/como-operar-opcoes-binarias-guia-completo-para-iniciantes` | `/opcoes-binarias-para-iniciantes` | duplicado de "para iniciantes" (57 visitas no GA4) |
| `/blog/opcoes-binarias-para-iniciantes-erros-comuns-a-evitar-e-dicas-para-iniciar-com-o-pe-direito` | `/opcoes-binarias-para-iniciantes` | duplicado de "para iniciantes" |
| `/blog/introducao-opcoes-binarias-guia-iniciantes` | `/opcoes-binarias-para-iniciantes` | duplicado de "para iniciantes" |
| `/blog/quem-opera-opcoes-binarias-tem-que-pagar-imposto-de-renda` | `/blog/como-declarar-imposto-de-renda-sobre-opcoes-binarias-no-brasil-guia-completo` | duplicado do imposto de renda |
| `/blog/estrategias-de-negociacao-em-opcoes-binarias-maximizando-seus-lucros` | `/blog/5-estrategias-simples-de-opcoes-binarias-para-iniciantes-que-funcionam` | título com promessa ("maximizando seus lucros") → estratégias simples |

## Atualizar depois
Tabela aprovada pelo Cristiano em 20/10/2026. Estes destinos são provisórios: trocar em `lib/redirecionamentos.json` (e aqui) quando a página nova existir, e rodar `node scripts/testar-urls.mjs` de novo.
1. **Artigo novo "Opções binárias é legal / é seguro no Brasil?"** (1º lote da reescrita): `/opcoes-binarias-legalizado-brasil`, `/opcoes-binarias-seguro` e `/blog/opcoes-binarias-e-seguro` passam a ir para ele (hoje → `/o-que-sao-opcoes-binarias`).
2. **Guia de gestão de risco** (`/blog/gestao-de-risco-no-day-trade`, guia novo do mapa): `/c/gestao-de-risco` continua como categoria; os 308 de `/blog/quanto-e-possivel-ganhar-com-day-trade-expectativas-versus-realidade` e `/blog/estrategias-populares-no-day-trade-uma-visao-geral-completa` passam a ir para o guia (hoje → `/c/gestao-de-risco`). O item "Gestão de risco" do menu também passa a apontar para o guia.
3. **Blog de cripto da Cristiano Pereira Trader**: os 4 endereços de cripto passam a ir para ele (hoje → `https://cristianopereira.com.br`): `/blog/halving-e-bitcoin-o-que-e-como-afeta-a-criptomoeda-mais-famosa-do-mundo`, `/blog/bitcoin-vs-altcoins-qual-criptomoeda-devo-escolher`, `/blog/introducao-as-criptomoedas-o-que-sao-como-funcionam` e `/c/criptomoedas`.
