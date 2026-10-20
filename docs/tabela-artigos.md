# Tabela `artigos` — desenho proposto (NÃO aplicado)
> 20/10/2026 · blog traderbinario.com.br · projeto Supabase do CPT (cpt-site).
> **Nada foi aplicado.** Quem aplica é o Cowork, com o ok do Cristiano. Depois de aplicada, só `lib/conteudo.ts` muda (passa a ler daqui em vez de `content/`).

## Para que serve
Guardar TODO o conteúdo do blog (artigos, análises de corretora, páginas-guia e páginas fixas como a home) em PT/EN/ES, com o fluxo de aprovação do PLANO.md:
`rascunho` (a tarefa semanal cria) → `aprovado` (o Cristiano aprovou no Painel CPT) → `publicado` (no ar; pode ter data agendada) → `arquivado` (saiu do ar).

## Segurança (padrão das tabelas do cpt-site, pedido de 20/10/2026)
- **RLS ligado e SEM nenhuma política** para `anon` ou `authenticated`: a tabela fica **trancada** para o navegador.
- O site lê **só no servidor**, com a chave secreta (`SUPABASE_SECRET_KEY`, igual ao `lib/supabase-servidor.ts` do site-cristianopereira e aos leads), e filtra `status = 'publicado'` na consulta.
- O Painel CPT escreve também só no servidor, com a mesma chave. A chave **nunca** vai para arquivo do repositório: só nas Environment Variables da Vercel e no `.env.local`.

## Colunas
| Coluna | Tipo | Para quê |
|---|---|---|
| `id` | uuid (PK) | identificador |
| `tipo` | text: `artigo` · `analise` · `guia` · `pagina` | decide o endereço (`/blog/<slug>` para artigo; `/<slug>` para análise, guia e página) |
| `idioma` | text: `pt` · `en` · `es` | PT na raiz, EN em `/en`, ES em `/es` |
| `slug` | text | parte final da URL (as da Builderall ficam iguais) |
| `traducao_de` | uuid → `artigos.id` (opcional) | liga a versão EN/ES ao original PT (hreflang e seletor) |
| `status` | text: `rascunho` · `aprovado` · `publicado` · `arquivado` | fluxo de aprovação |
| `titulo` | text | H1 (com a palavra-chave) |
| `titulo_destaque` | text | trecho do título em itálico ciano (DLS) |
| `resumo` | text | apoio abaixo do título e lista de artigos |
| `corpo_md` | text | texto em Markdown (com os blocos `:::na-pratica`, `:::sessoes`…) |
| `seo_title` | text (≤ 60) | `<title>` |
| `seo_description` | text (≤ 155) | meta description |
| `categoria` | text | tema (Opções binárias, Forex, Robôs traders, MetaTrader, Gestão de risco, Corretoras) |
| `categoria_href` | text | página-guia do tema (trilha e menu) |
| `capa_url` · `capa_alt` · `capa_largura` · `capa_altura` | text · text · int · int | capa do artigo (Supabase Storage ou `/public`) |
| `faq` | jsonb `[{p, r}]` | perguntas frequentes (vira FAQPage) |
| `ficha` | jsonb `[{rotulo, valor}]` | ficha da corretora (só análises) |
| `corretora` | jsonb `{nome, logo, linha, rotulo}` | cabeçalho da ficha (só análises) |
| `pros` · `contras` | text[] | pontos fortes e de atenção (só análises) |
| `outras` | jsonb `[{nome, href}]` | lateral "Outras corretoras" (só análises) |
| `relacionados` | jsonb `[{titulo, href}]` | "Continue lendo" |
| `extra` | jsonb | campos próprios de uma página (ex.: blocos da home) |
| `autor` | text, padrão `Cristiano Pereira` | autor |
| `palavra_chave` | text | palavra-chave principal (painel e checagem) |
| `revisao_notas` | text | o que o Cristiano pediu de ajuste ("Pedir ajuste" no painel) |
| `criado_em` · `atualizado_em` | timestamptz | automático |
| `aprovado_em` · `publicado_em` · `agendado_para` | timestamptz | aprovação, publicação e agendamento |

## SQL (para o Cowork aplicar com ok)
```sql
-- Tabela de conteúdo do blog traderbinario.com.br (PLANO.md, 20/10/2026)
create table public.artigos (
  id               uuid primary key default gen_random_uuid(),
  tipo             text not null check (tipo in ('artigo', 'analise', 'guia', 'pagina')),
  idioma           text not null default 'pt' check (idioma in ('pt', 'en', 'es')),
  slug             text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  traducao_de      uuid references public.artigos (id) on delete set null,
  status           text not null default 'rascunho' check (status in ('rascunho', 'aprovado', 'publicado', 'arquivado')),
  titulo           text not null,
  titulo_destaque  text,
  resumo           text,
  corpo_md         text not null default '',
  seo_title        text not null check (char_length(seo_title) <= 60),
  seo_description  text not null check (char_length(seo_description) <= 155),
  categoria        text,
  categoria_href   text,
  capa_url         text,
  capa_alt         text,
  capa_largura     int,
  capa_altura      int,
  faq              jsonb not null default '[]'::jsonb,
  ficha            jsonb,
  corretora        jsonb,
  pros             text[],
  contras          text[],
  outras           jsonb,
  relacionados     jsonb not null default '[]'::jsonb,
  extra            jsonb not null default '{}'::jsonb,
  autor            text not null default 'Cristiano Pereira',
  palavra_chave    text,
  revisao_notas    text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now(),
  aprovado_em      timestamptz,
  publicado_em     timestamptz,
  agendado_para    timestamptz,
  unique (idioma, slug),
  -- capa com texto alternativo sempre
  check (capa_url is null or capa_alt is not null),
  -- publicado precisa de data de publicação
  check (status <> 'publicado' or publicado_em is not null)
);

comment on table public.artigos is 'Blog traderbinario.com.br: artigos, análises, guias e páginas (PT/EN/ES). Lido só no servidor com a chave secreta.';

-- Consultas do site (publicados por idioma e tipo, mais recentes primeiro) e do painel (por status)
create index artigos_publicados_idx on public.artigos (idioma, tipo, publicado_em desc) where status = 'publicado';
create index artigos_status_idx on public.artigos (status, atualizado_em desc);
create index artigos_traducao_idx on public.artigos (traducao_de) where traducao_de is not null;

-- atualizado_em automático
create or replace function public.artigos_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger artigos_atualizado_em
  before update on public.artigos
  for each row execute function public.artigos_atualizado_em();

-- Tabela TRANCADA: RLS ligado e NENHUMA política (anon e authenticated não leem nem escrevem).
-- Site e Painel CPT acessam só no servidor com a chave secreta (SUPABASE_SECRET_KEY), que ignora o RLS.
alter table public.artigos enable row level security;
-- (Opcional, reforço — só se as outras tabelas do cpt-site também fizerem; o Cowork confere e decide:)
-- revoke all on public.artigos from anon, authenticated;
```

## Como o site vai ler (depois de aplicada)
- `lib/conteudo.ts`: `listar`, `buscar` e `idiomasDisponiveis` passam a consultar a tabela com o cliente de servidor (`select … where status = 'publicado' and (agendado_para is null or agendado_para <= now())`), mantendo o mesmo formato `Conteudo` — páginas e componentes não mudam.
- Os 3 arquivos de `content/` viram as 3 primeiras linhas da tabela (importação com ok).
- Publicar sem novo deploy: revalidação por tempo (ex.: 1 h) ou por aviso do painel (a decidir na etapa da automação).

## Checagens do painel antes de "Aprovar e publicar" (do PLANO.md)
Palavras proibidas da voz da marca · promessa de lucro/percentual · link da Deriv = `t.deriv.link?t=75992B6H3EDR` · aviso de risco presente quando fala de operação/corretora · `seo_title` ≤ 60 e `seo_description` ≤ 155 · capa com alt.
