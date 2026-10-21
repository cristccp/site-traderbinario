// Testa TODAS as URLs antigas (docs/inventario-builderall.txt): cada uma tem que dar 200,
// ou 308 para um destino que dá 200 (até 3 saltos). 404, 301/302 ou destino quebrado = falha.
// Uso: node scripts/testar-urls.mjs [base]   (padrão: http://localhost:3010; serve também para o domínio novo depois da virada)
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "http://localhost:3010").replace(/\/$/, "");
const urls = readFileSync(path.join(RAIZ, "docs", "inventario-builderall.txt"), "utf8")
  .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));

async function seguir(url) {
  const passos = [];
  let atual = url;
  for (let i = 0; i < 4; i++) {
    const r = await fetch(atual, { redirect: "manual", headers: { "user-agent": "testar-urls (traderbinario)" } });
    passos.push(r.status);
    if (r.status === 200) return { ok: true, passos, final: atual };
    if (r.status !== 308) return { ok: false, passos, final: atual, erro: `status ${r.status}` };
    atual = new URL(r.headers.get("location"), atual).href;
  }
  return { ok: false, passos, final: atual, erro: "mais de 3 saltos" };
}

let falhas = 0, diretas = 0, redirecionadas = 0;
for (const u of urls) {
  const r = await seguir(BASE + u);
  const destino = r.final.replace(BASE, "") || "/";
  if (!r.ok) { falhas++; console.log(`✗ ${u}  →  ${destino}  (${r.passos.join(" → ")}; ${r.erro})`); continue; }
  if (r.passos.length === 1) diretas++;
  else { redirecionadas++; console.log(`↪ ${u}  →  ${destino}  (${r.passos.join(" → ")})`); }
}
console.log(`\n${urls.length} URLs · ${diretas} com 200 direto · ${redirecionadas} com 308 → 200 · ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
