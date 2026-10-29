import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Aviso de país (EN/ES): topo dos artigos e guias (bloco :::aviso-pais) e das categorias. Texto fixo do dicionário (avisoPais).
// data-aviso-pais = o marcador que o scripts/conferir-site.mjs procura para liberar "binary options/opciones binarias" (29/10/2026).
export default function AvisoPais({ idioma, className = "" }: { idioma: Idioma; className?: string }) {
  const t = textos(idioma);
  if (!t.avisoPais) throw new Error(`aviso de país sem texto no dicionário (${idioma})`);
  return <div className={`aviso-texto prose prose--caixa ${className}`.trim()} role="note" data-aviso-pais=""><p>{t.avisoPais}</p></div>;
}
