"use client";

import { useEffect, useId, useRef, useState } from "react";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { track } from "@/lib/medicao";

// Calculadoras de gestão de risco (sem projeção de ganho; tudo no navegador, nada é guardado):
//  - risco: valor por operação, stop do dia (em dinheiro e em % da banca) e perdas seguidas até −20% (valor fixo);
//  - empate: acertos mínimos só para empatar = 1 ÷ (1 + payout).
// Evento calc_use { calc } 1 vez por página, quando aparece o primeiro resultado válido.
// Banca em texto no jeito do idioma: PT/ES "1.000,50", EN "1,000.50"; os outros campos são type=number (o navegador já usa ponto)
const numBR = (s: string) => Number(s.trim().replace(/\./g, "").replace(",", "."));
const numEN = (s: string) => Number(s.trim().replace(/,/g, ""));
const numCampo = (s: string) => Number(s.replace(",", "."));
// Dinheiro: PT em R$ ou US$ (seletor); EN e ES só em dólar — EN "$1,000.00", ES "US$ 1.000,00" (público latino)
const LOCALE: Record<Idioma, string> = { pt: "pt-BR", en: "en-US", es: "es-AR" };
function formatarDinheiro(idioma: Idioma, moeda: "BRL" | "USD", v: number) {
  if (idioma === "es") return "US$ " + v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" });
  return new Intl.NumberFormat(LOCALE[idioma], { style: "currency", currency: idioma === "en" ? "USD" : moeda }).format(v);
}

export default function Calculadora({ modo, idioma = "pt" }: { modo: "risco" | "empate"; idioma?: Idioma }) {
  const t = textos(idioma).calc;
  const id = useId();
  const medido = useRef(false);
  const [banca, setBanca] = useState("1000");
  const [pct, setPct] = useState("1");
  const [perdas, setPerdas] = useState("3");
  const [moeda, setMoeda] = useState<"BRL" | "USD">("BRL");
  const [payout, setPayout] = useState("85");

  const dinheiro = { format: (v: number) => formatarDinheiro(idioma, moeda, v) };
  const pctFmt = (n: number, casas = 1) => n.toLocaleString(LOCALE[idioma], { minimumFractionDigits: casas, maximumFractionDigits: casas }) + "%";

  // risco
  const b = idioma === "en" ? numEN(banca) : numBR(banca), p = numCampo(pct), n = Math.round(numCampo(perdas));
  const erroBanca = !(b > 0), erroPct = !(p >= 0.5 && p <= 5), erroPerdas = !(n >= 1 && n <= 20);
  const riscoOk = !erroBanca && !erroPct && !erroPerdas;
  // empate
  const py = numCampo(payout);
  const erroPayout = !(py >= 50 && py <= 100);
  const empateOk = !erroPayout;
  const ok = modo === "risco" ? riscoOk : empateOk;

  useEffect(() => {
    if (ok && !medido.current) { medido.current = true; track("calc_use", { calc: modo }); }
  }, [ok, modo]);

  if (modo === "empate") {
    return (
      <section className="calc cartao" aria-labelledby={`${id}-t`}>
        <h3 id={`${id}-t`} className="calc__titulo">{t.empate.titulo}</h3>
        <div className="calc__campos">
          <label className="calc__campo">
            <span>{t.empate.payout}</span>
            <input type="number" inputMode="decimal" min={50} max={100} step={1} value={payout} onChange={(e) => setPayout(e.target.value)} aria-invalid={erroPayout} />
          </label>
        </div>
        <div className="calc__resultado" aria-live="polite">
          {empateOk ? (
            <>
              <div className="calc__linha calc__linha--destaque"><span>{t.empate.resultado}</span><strong>{pctFmt(100 / (1 + py / 100))}</strong></div>
              <p className="calc__nota">{t.empate.frase}</p>
            </>
          ) : <p className="calc__erro">{t.empate.erroPayout}</p>}
        </div>
      </section>
    );
  }

  const valorOp = b * p / 100;
  return (
    <section className="calc cartao" aria-labelledby={`${id}-t`}>
      <h3 id={`${id}-t`} className="calc__titulo">{t.risco.titulo}</h3>
      <div className="calc__campos">
        <label className="calc__campo">
          <span>{t.risco.banca}</span>
          <input type="text" inputMode="decimal" value={banca} onChange={(e) => setBanca(e.target.value)} aria-invalid={erroBanca} />
        </label>
        {idioma === "pt" && (
          <label className="calc__campo calc__campo--curto">
            <span>{t.risco.moeda}</span>
            <select value={moeda} onChange={(e) => setMoeda(e.target.value as "BRL" | "USD")}>
              <option value="BRL">R$</option>
              <option value="USD">US$</option>
            </select>
          </label>
        )}
        <label className="calc__campo">
          <span>{t.risco.pct}</span>
          <input type="number" inputMode="decimal" min={0.5} max={5} step={0.5} value={pct} onChange={(e) => setPct(e.target.value)} aria-invalid={erroPct} />
        </label>
        <label className="calc__campo">
          <span>{t.risco.perdas}</span>
          <input type="number" inputMode="numeric" min={1} max={20} step={1} value={perdas} onChange={(e) => setPerdas(e.target.value)} aria-invalid={erroPerdas} />
        </label>
      </div>
      <div className="calc__resultado" aria-live="polite">
        {riscoOk ? (
          <>
            {p > 2 && <p className="calc__aviso" role="note">{t.risco.aviso}</p>}
            <div className="calc__linha calc__linha--destaque"><span>{t.risco.valorOp}</span><strong>{dinheiro.format(valorOp)}</strong></div>
            <div className="calc__linha"><span>{t.risco.stopDia}</span><strong>{dinheiro.format(valorOp * n)} · {pctFmt(p * n)} {t.risco.daBanca}</strong></div>
            <div className="calc__linha"><span>{t.risco.perdas20} <small>({t.risco.perdas20Nota})</small></span><strong>{Math.ceil(20 / p - 1e-9)}</strong></div>
          </>
        ) : (
          <p className="calc__erro">{erroBanca ? t.risco.erroBanca : erroPct ? t.risco.erroPct : t.risco.erroPerdas}</p>
        )}
      </div>
    </section>
  );
}
