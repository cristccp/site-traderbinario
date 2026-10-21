# CLAUDE.md — site traderbinario.com.br (blog)

> Regras permanentes para TODO ajuste neste repositório (`cristccp/site-traderbinario`).
> Lido junto com o `CLAUDE.md` da empresa e o do head 04 (pastas acima). Plano: `../PLANO.md` · mapa: `../mapa-conteudo-2026-10-20.md`.
> Nasceu em 20/10/2026 (estrutura + 3 modelos de página, só localhost), com a base técnica do forexbots.

## 1. Quem é
- **Blog** do Trader Binário ("por Cristiano Pereira"): guias e artigos de opções binárias, forex, robôs traders, MetaTrader, gestão de risco e análises de corretoras. Sai da Builderall para a Vercel **mantendo as URLs que rankeiam**. Head: **04 Funis & Captura** (+05 afiliação, +09 painel, +10 compliance).
- Dono: **Cristiano**, iniciante em código → explicar cada passo em português simples.
- Hoje: só localhost. Sem Vercel, sem DNS, GTM no código (GTM-MTJMBXSR) mas contêiner ainda não publicado, sem Supabase (a tabela `artigos` está só desenhada em `docs/tabela-artigos.md`).

## 2. Visual
- Design aprovado: `../design/` (home, artigo, análise). DLS: `../../../01-diretoria-marca/contexto/dls.md` — Fraunces 600 nos títulos com 1–2 palavras em *itálico ciano*, Poppins no texto, fundo `#07090c`, cards `#11161d`, linhas `#1e2631`.
- **Sempre** os tokens de `app/tokens.css` (cópia do site principal + bloco "Blog"). Faltou token? Criar lá com "levar ao DLS" e avisar o Cristiano.
- Celular obrigatório: sem rolagem lateral em 390 px, menu ☰ acessível (Esc fecha), foco visível, "reduzir movimento".

## 3. Peças
| Arquivo | O que faz |
|---|---|
| `content/artigos · analises · paginas/<slug>.<idioma>.md` | **O conteúdo** (Markdown + frontmatter YAML). Só `status: publicado` aparece |
| `lib/conteudo.ts` | Camada única de leitura (`listar`, `buscar`, `idiomasDisponiveis`, `caminho`). Quando a tabela `artigos` existir, só ela muda |
| `lib/markdown.ts` | Markdown → HTML no servidor + blocos `:::sessoes`, `:::na-pratica`, `:::aviso`, `:::selos`, `:::deriv`, `:::video` |
| `lib/seo.ts` | title/description, canonical sem www, hreflang só entre idiomas que existem, Open Graph, JSON-LD (Article, BreadcrumbList, FAQPage) |
| `app/(pt)` · `app/en` · `app/es` | Um layout raiz por idioma; rotas `/`, `/blog/[slug]`, `/[slug]` (análises e, depois, guias). EN/ES sem conteúdo → 404 |
| `components/paginas/Pagina{Home,Artigo,Analise}` | Os 3 modelos de página |
| `components/LinkDeriv · LinkTelegram · LinkCorretora` | TODO link de Deriv, Telegram e outras corretoras passa por eles (nova aba, `sponsored` nos de afiliado, evento) |
| `lib/i18n/{pt,en,es}.ts` | Textos FIXOS (menu, rodapé, rótulos, banner). Nunca texto solto nos componentes |
| `lib/deriv.ts` · `lib/corretoras.ts` · `lib/telegram.ts` · `lib/redes.ts` | Links num lugar só |
| `lib/site.ts` | Domínio oficial, hosts oficiais, `GTM_ID` (GTM-MTJMBXSR) |
| `proxy.ts` | Fora de traderbinario.com.br (localhost, vercel.app) → `X-Robots-Tag: noindex` + `robots.txt` `Disallow: /` |
| `scripts/converter-imagens.mjs` | `npm run imagens`: imagens da `_copia` e foto do Cristiano → WebP em `public/` |
| `docs/` | `tabela-artigos.md` (desenho + SQL, NÃO aplicado) · `revisao-conteudo.md` (trocas, textos novos, [VERIFICAR], encurtadores) |

## 4. Textos e compliance
- Texto das páginas antigas = `../_copia/`, só com trocas listadas em `docs/revisao-conteudo.md`. Nada novo sem aprovação.
- Proibidos: "1% a 3% ao dia", "renda no automático", "lucro garantido", qualquer promessa ou percentual de retorno, "jogo" para trading, as palavras de `contexto/voz-da-marca.md`. Deriv = "a corretora que eu uso".
- Aviso de risco no rodapé (texto oficial) + onde fala de operação/corretora (box, ficha, lateral, fim do artigo, faixa de corretoras). "Este site contém links de afiliado" e "Não somos corretora" no rodapé.
- Dado sem fonte na cópia = [VERIFICAR] e fica fora da página.

## 5. SEO e velocidade
- Artigo: H1 com a palavra-chave, title ≤ 60, description ≤ 155 (o terminal avisa em desenvolvimento). Um H1 por página.
- URLs da Builderall mantidas. Sitemap só com páginas publicadas. Lighthouse celular ≥ 90 em desempenho (20/10/2026: 97 nas 3).
- Links internos para páginas ainda não migradas usam `prefetch={false}`.

## 6. Medição (GTM no código, contêiner sem publicar)
9 eventos por `lib/medicao.ts` (sem dado pessoal): `deriv_click {local, pagina}` · `telegram_click {idioma}` · `broker_click {corretora}` · `search {search_term}` · `ebook_click {material, local}` · `calc_use {calc}` · `glossario_dica {termo}` · `tutor_open` · `tutor_cta {destino}`. Consent Mode v2 + banner (cópia do forexbots). GTM **GTM-MTJMBXSR** (21/10/2026) só no domínio oficial (`HOSTS_OFICIAIS`); GA4 (propriedade 310528845, G-8NBG9D5K3L) dentro do GTM, nunca gtag direto.

## 7. Segurança e git
- **Nenhuma** chave em arquivo. `.gitignore` ativo.
- **Nunca** commit nem push sem o Cristiano pedir; **um comando de git por vez**; nunca `--force`. Usar `/commit-seguro`.

## Comandos
| Comando | Para quê |
|---|---|
| `npm run dev` | Liga o site → http://localhost:3010 |
| `npm run lint` · `npm run build` | Conferir antes de qualquer commit |
| `npm run imagens` | Converter imagens novas para WebP |

Regras técnicas do Next.js 16: ver `AGENTS.md`.
