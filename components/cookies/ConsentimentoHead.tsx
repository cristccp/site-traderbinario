import { GTM_ID, HOSTS_OFICIAIS } from "@/lib/site";
import { COOKIE_CONSENTIMENTO } from "@/lib/consentimento-cookies";

// Roda no <head>, ANTES de qualquer outro script (Consent Mode v2):
//  1. cria o dataLayer e o gtag e define o padrão: análise e anúncios NEGADOS, funcionais e segurança liberados;
//  2. se a pessoa já escolheu "Aceitar" (cookie cpt_consent, 12 meses), libera SÓ analytics_storage;
//  3. só no domínio oficial E com GTM_ID preenchido carrega o GTM (GTM_ID em lib/site.ts).
// Cópia do site principal + a trava do GTM_ID vazio.
const script = `(function(){var w=window,d=document;w.dataLayer=w.dataLayer||[];function gtag(){w.dataLayer.push(arguments)}w.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
var m=d.cookie.match(/(?:^|; )${COOKIE_CONSENTIMENTO}=(granted|denied)/);if(m&&m[1]==='granted')gtag('consent','update',{analytics_storage:'granted'});
var id=${JSON.stringify(GTM_ID)};if(!id||${JSON.stringify(HOSTS_OFICIAIS)}.indexOf(location.hostname)<0)return;
w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id='+id;d.head.appendChild(s);})();`;

export default function ConsentimentoHead() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
