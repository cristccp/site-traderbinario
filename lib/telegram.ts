import type { Idioma } from "@/lib/i18n/tipos";

// Grupo do Telegram por idioma — NUM LUGAR SÓ (padrao-idiomas.md, regra 5).
// PT = grupo principal. EN/ES guardados para quando o blog tiver páginas nesses idiomas.
// Todo botão de Telegram do site usa components/LinkTelegram (registra telegram_click com o idioma).
export const TELEGRAM: Record<Idioma, string> = {
  pt: "https://t.me/cristianotraderbinario",
  en: "https://t.me/TraderForexOptions",
  es: "https://t.me/opcionesbinariastb",
};
