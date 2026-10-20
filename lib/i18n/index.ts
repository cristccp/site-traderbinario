import type { Idioma, Textos } from "@/lib/i18n/tipos";
import { EN } from "@/lib/i18n/en";
import { ES } from "@/lib/i18n/es";
import { PT } from "@/lib/i18n/pt";

// Dicionário de textos fixos de cada idioma (padrao-idiomas.md, regra 9).
const DICIONARIOS: Record<Idioma, Textos> = { pt: PT, en: EN, es: ES };
export const textos = (idioma: Idioma): Textos => DICIONARIOS[idioma];
