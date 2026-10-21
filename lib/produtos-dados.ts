// GERADO por scripts/gerar-produtos.mjs — NÃO EDITAR À MÃO.
// Fonte única: site-cristianopereira/lib/precos.ts (preços) e app/(vendas)/vendas.ts (página de vendas, título e descrição).
// Usado pela base do tutor (scripts/gerar-base-tutor.mjs) e pela medição tutor_cta (destino "venda").
export type Produto = { id: string; nome: string; descricao: string; preco: string; url: string };
export const PRODUTOS: Produto[] = [
  {
    "id": "fundamentos",
    "nome": "Fundamentos do Trader Consistente",
    "descricao": "Curso curto e direto sobre risco, controle e disciplina antes de qualquer estratégia. Acesso vitalício por R$57.",
    "preco": "R$57 (acesso vitalício)",
    "url": "https://cristianopereira.com.br/fundamentos-trader-consistente"
  },
  {
    "id": "checklist",
    "nome": "Checklist do Trader Consistente",
    "descricao": "Checklist diário com 4 aulas e planilha para decidir quando operar, quando parar e como encerrar o dia. R$47 por ano.",
    "preco": "R$47 por ano",
    "url": "https://cristianopereira.com.br/checklist-trader-consistente"
  },
  {
    "id": "agentes",
    "nome": "Agentes de IA do Trader Consistente",
    "descricao": "6 agentes de IA que questionam, alertam e calculam antes do clique: expectativa, gestão de banca, perfil, psicologia, análise e carteira.",
    "preco": "R$97 (trimestral), R$147 (semestral) ou R$237 (anual)",
    "url": "https://cristianopereira.com.br/agentes-de-ia-trader-consistente"
  },
  {
    "id": "expertDeriv",
    "nome": "Expert Deriv",
    "descricao": "Curso completo da Deriv em 5 módulos: conta, depósito e saque, DTrader, SmartTrader, Deriv Bot, CFDs no MT5 e app. R$47 por ano.",
    "preco": "R$47 por ano",
    "url": "https://cristianopereira.com.br/expert-deriv"
  },
  {
    "id": "acessoPremium",
    "nome": "Acesso Premium",
    "descricao": "Acesso anual aos recursos premium da Trader Bots, com curso de uso responsável de robôs na Deriv: limite, risco, quando desligar e saque. R$197 por ano.",
    "preco": "R$197 por ano",
    "url": "https://cristianopereira.com.br/acesso-premium"
  }
];
