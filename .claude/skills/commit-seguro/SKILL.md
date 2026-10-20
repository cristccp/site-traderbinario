---
name: commit-seguro
description: Commit e push seguros para o GitHub nos repositórios do Cristiano (site cristianopereira.com.br e próximos): lista em português o que sobe, barra arquivos de chave e arquivos grandes, procura chave escondida no código, roda lint e build e só faz commit e push com ok, um comando por vez. Usar quando ele pedir "commit", "manda pro GitHub", "sobe", "push" ou /commit-seguro.
---

# commit-seguro — commit e push sem vazar nada

> Versão 1.0 — 15/10/2026. Head 09 Tech & Automações. OFICIAL = `09-tech-automacoes/skills/commit-seguro/` na pasta da empresa.
> Cópia de uso em cada repositório: `.claude/skills/commit-seguro/SKILL.md` (para o Claude Code do VS Code chamar com /commit-seguro). Se mudar, mudar primeiro a oficial e depois copiar.
> Nasceu de uma tarefa repetida 6 vezes no site novo (regra 9 do CLAUDE.md da empresa).

## Regras fixas
- **Nada sobe sem o ok do Cristiano.** Mostrar a lista e a mensagem antes; esperar "ok".
- **Um comando de git por vez** (nunca encadear com `;` ou `&&`): o Cristiano aprova cada um.
- Nunca usar `git push --force`, `--no-verify`, `git reset --hard`, `git clean`, nem reescrever histórico.
- Nunca imprimir o valor de uma chave encontrada: dizer só o arquivo, a linha e o tipo.
- Explicar em português simples, sem jargão.

## O que NUNCA pode subir (barra e para)
| Tipo | Exemplos |
|---|---|
| Chaves e configurações locais | `.env`, `.env.local`, `.env.*` (exceto `.env.example` sem valores), `.mcp.json`, `.claude/settings.local.json` |
| Certificados e credenciais | `*.pem`, `*.key`, `*.p12`, `credentials*.json`, `service-account*.json`, `id_rsa*` |
| Pastas geradas | `node_modules/`, `.next/`, `out/`, `dist/`, `.vercel/` |
| Arquivos grandes | qualquer arquivo acima de **5 MB** (PDFs de e-book vão para o Supabase Storage, vídeos para o lugar certo — não para o GitHub) |
| Dados pessoais | planilhas/CSV de leads ou alunos, exportações de contatos |

Se aparecer algum: **não fazer o commit**, mostrar o arquivo e sugerir a correção (tirar do commit e incluir no `.gitignore`), com ok.

## Processo
1. **Onde estou** — `git status -sb` e `git branch --show-current`. Avisar se não for a `main` ou se houver algo esquisito (conflito, branch atrasada).
2. **Lista em português** — `git status --porcelain` → tabela: arquivo · novo / alterado / apagado · tamanho. Arquivos acima de 5 MB marcados.
3. **Barreira** — conferir a lista contra "O que NUNCA pode subir". Conferir também se o `.gitignore` tem `.env*`, `.mcp.json`, `.claude/settings.local.json`, `node_modules`, `.next`.
4. **Chave escondida no código** — procurar nas mudanças (`git diff` e arquivos novos) padrões como:
   - `sk_live_`, `sk_test_`, `rk_live_` (pagamentos) · `re_` seguido de letras/números longos (Resend)
   - `eyJhbGciOi` (token JWT, ex.: chave service_role do Supabase) · `service_role` · `SUPABASE_SERVICE_ROLE_KEY=` com valor
   - `ghp_`, `github_pat_` (GitHub) · `AKIA` (AWS) · `AIza` (Google) · `-----BEGIN` (chave privada)
   - linhas `SENHA=`, `PASSWORD=`, `TOKEN=`, `API_KEY=` com valor
   Achou → **para**, mostra arquivo + linha + tipo (sem o valor) e explica. A chave vazada tem que ser trocada no serviço, mesmo que não tenha subido ainda se já esteve em algum print.
   (A chave pública do Supabase — `anon`/publishable — e a URL do projeto podem aparecer no código do site; a `service_role` NUNCA.)
5a. **Formulário mexido?** Se a mudança toca formulário ou a rota que grava cadastro (ex.: `/api/lead`), lembrar antes do commit: campo escondido (honeypot) com nome neutro (nada que lembre nome/e-mail/site/telefone/empresa), autocomplete="off", tabIndex -1, aria-hidden, fora da tela por CSS e sem rótulo de contato; o tempo mínimo é a trava principal; só descartar o envio quando as DUAS travas acusarem robô; antes de ir ao ar, testar com o PREENCHIMENTO AUTOMÁTICO do Chrome (e do celular) e conferir no banco que o cadastro gravou (regra de 16/10/2026). Sem esse teste, avisar o Cristiano.
5. **Lint e build** — `npm run lint` e `npm run build` (se o projeto tiver). Erro → não commitar; mostrar o erro e propor a correção.
6. **Mensagem** — sugerir em português, curta e clara ("Captura modelo + download: Por que Traders Quebram Banca"), terminando com a linha de coautoria se o Claude ajudou. Mostrar tudo e **esperar o ok**.
7. **Commit** — `git add` só dos arquivos da lista aprovada (preferir nomes/pastas explícitos a `git add -A`; se usar `-A`, só depois da barreira passar), depois `git commit -m "..."`. Um comando por vez.
8. **Push** — `git push origin main` (ou a branch atual), sozinho.
9. **Confirmar** — `git log -1 --oneline` e `git status -sb`: mostrar o código do commit e confirmar "computador e GitHub iguais" ("main -> main" no push). Se a Vercel estiver ligada ao repositório, lembrar que ela publica sozinha a partir da main.

## Saída (relato final)
- Código e mensagem do commit · quantos arquivos subiram · "nenhum arquivo de chave, nenhum arquivo grande" (ou o que foi barrado) · resultado do lint e do build · se a Vercel vai publicar.

## Se algo der errado
- Push recusado (GitHub tem coisa nova): **não** forçar. `git pull --rebase origin main` só com ok, depois push.
- Login pedido: o login é pelo navegador (Git Credential Manager). Nunca colar token no chat ou em arquivo.
- Chave subiu por engano: avisar na hora → trocar a chave no serviço (Supabase/Resend/etc.) primeiro; limpar o histórico é secundário e só com ok.
