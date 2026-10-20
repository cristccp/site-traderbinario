import { partesTitulo } from "@/lib/markdown";

// Título do DLS: Fraunces 600 com 1–2 palavras em itálico ciano (<em>). `nivel` = h1 | h2.
export default function Titulo({ texto, destaque, nivel = "h2", className }:
  { texto: string; destaque?: string; nivel?: "h1" | "h2"; className?: string }) {
  const { antes, em, depois } = partesTitulo(texto, destaque);
  const Tag = nivel;
  return <Tag className={className}>{antes}{em && <em>{em}</em>}{depois}</Tag>;
}
