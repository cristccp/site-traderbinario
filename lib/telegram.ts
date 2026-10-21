import type { Idioma } from "@/lib/i18n/tipos";

// Grupo do Telegram por idioma — NUM LUGAR SÓ (padrao-idiomas.md, regra 5).
// Convites próprios do blog (traderbinario-pt/en/es), aprovados em 21/10/2026 — substituem os grupos antigos.
// Todo botão de Telegram do site usa components/LinkTelegram (registra telegram_click com o idioma).
export const TELEGRAM: Record<Idioma, string> = {
  pt: "https://t.me/+LBSmzMzmlyo3ZjJh",
  en: "https://t.me/+fzd_tPzuteI1ZmI5",
  es: "https://t.me/+qBhgQs8ZwA9iZjQx",
};
