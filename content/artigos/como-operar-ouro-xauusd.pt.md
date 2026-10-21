---
# Artigo NOVO (skill artigo-blog) aprovado pelo Cristiano em 21/10/2026 (fonte: entregas/artigos/como-operar-ouro-xauusd.pt.md). NÃO regenerar pelo migrar.mjs.
tipo: artigo
idioma: pt
slug: como-operar-ouro-xauusd
status: publicado
titulo: "Como operar ouro (XAU/USD) no forex: guia para iniciantes"
tituloDestaque: ouro
resumo: "O que mexe no preço do ouro, onde ele fica no MetaTrader 5, como o lote define o seu risco, os horários de mais movimento e por que começar na conta demo."
seo:
  title: "Como operar ouro (XAU/USD): guia para iniciantes"
  description: "Como operar ouro (XAU/USD) no MetaTrader 5: o que mexe no preço, horários, lote e stop, quanto arriscar por operação e por que começar na conta demo."
capa:
  src: /imagens/como-operar-ouro-xauusd/capa.webp
  alt: "Barra de ouro em neon dourado e ciano sobre um gráfico discreto, com o título Como operar ouro (XAU/USD)"
  largura: 1280
  altura: 720
categoria:
  nome: Forex
  href: /c/forex
trilha: Ouro (XAU/USD)
ebook: gestao-de-risco
emResumo:
  - "XAU/USD é o ouro cotado em dólar; no MetaTrader 5 costuma aparecer como XAUUSD."
  - "O ouro se mexe rápido: quem decide o seu risco é o tamanho do lote, não a alavancagem."
  - "Antes de entrar: risco por operação perto de 1% da banca, stop definido e lote calculado a partir dele."
  - "Comece pela conta demo e fuja de dobrar a entrada para recuperar."
autor: Cristiano Pereira
publicadoEm: null
atualizadoEm: 2026-10-21
faq:
  - p: O que é XAU/USD?
    r: "É o ouro cotado em dólar: o preço de uma onça de ouro em dólares americanos. No MetaTrader 5 ele costuma aparecer como XAUUSD, mas o nome exato pode mudar de uma corretora para outra."
  - p: Dá para operar ouro sendo iniciante?
    r: "Dá para aprender, começando pela conta demo e com a gestão de risco definida antes da primeira operação. O ouro se mexe rápido, então o tamanho do lote pesa mais do que em muitos pares de moedas. Na conta real, comece com o lote mínimo e um valor que você pode perder."
  - p: Quanto vale 0,01 lote no ouro?
    r: "Depende do tamanho do contrato da sua corretora. Em muitas, 1 lote de ouro equivale a 100 onças: aí cada dólar de movimento no preço vale US$ 1 com 0,01 lote e US$ 10 com 0,10 lote. Confira sempre na especificação do ativo dentro do MetaTrader 5."
  - p: Qual é o melhor horário para operar ouro?
    r: "O ouro costuma ter mais movimento quando Londres e Nova York estão abertas ao mesmo tempo, mais ou menos entre 9h e 13h de Brasília, e na saída de notícias da economia dos Estados Unidos. Mais movimento também significa mais risco: para quem está começando, evite operar no minuto da notícia."
  - p: Quanto preciso para começar a operar ouro?
    r: "Para aprender, nada: a conta demo vem com saldo virtual. Na conta real, o valor mínimo depende da corretora, mas o que importa é outro número: quanto você arrisca por operação. Um ponto de partida conservador é algo perto de 1% da banca."
  - p: Robô para ouro funciona?
    r: "Robô é ferramenta, não garantia. Ele automatiza entradas, mas quem define o risco é a sua gestão. Alguns robôs trabalham com preço médio, abrindo novas ordens quando o mercado vai contra, o que aumenta a exposição. Teste sempre na conta demo, com lote mínimo e limite de perda."
relacionados:
  - titulo: "MetaTrader 5 (MT5): guia completo para iniciantes"
    href: /blog/metatrader-5-mt5-guia-completo
  - titulo: "Alavancagem no forex: o que é e como funciona"
    href: /blog/alavancagem-no-forex-o-que-e-como-funciona-e-como-usar-com-seguranca
  - titulo: "Forex é legal no Brasil? Entenda a regulamentação e os riscos"
    href: /blog/forex-e-legal-no-brasil-entenda-a-regulamentacao-e-os-riscos
---

**Operar ouro no forex é negociar o XAU/USD, o preço do ouro em dólar, numa plataforma como o MetaTrader 5.** O primeiro passo não é achar a entrada: é saber quanto cada movimento do preço vale no seu lote e decidir o seu risco antes de clicar.

O ouro é o ativo que mais atrai quem está começando. Ele se mexe muito, aparece em notícia todo dia e parece fácil de ler no gráfico. É exatamente por isso que ele quebra tanta banca de quem entra sem método.

Neste artigo eu te mostro o que mexe no preço do ouro, onde ele fica no MetaTrader 5, como calcular o lote a partir do seu stop e os horários de mais movimento.

## O que é o *XAU/USD*

XAU é o código do ouro e USD é o dólar americano. O XAU/USD mostra **quantos dólares custa uma onça de ouro**. Se o preço sobe, o ouro está mais caro em dólar. Se cai, mais barato.

No MetaTrader 5, o ativo costuma aparecer como **XAUUSD** (às vezes com uma letra a mais no fim, conforme a corretora). Para aprender a usar a plataforma do zero, veja o [guia completo do MetaTrader 5](/blog/metatrader-5-mt5-guia-completo).

Na prática, você não compra ouro de verdade: opera um contrato que acompanha o preço. Você pode entrar comprado (se acha que vai subir) ou vendido (se acha que vai cair). Ganhar nos dois sentidos também significa **perder nos dois sentidos**.

## O que *mexe* no preço do ouro

O ouro reage ao mundo, e reage rápido:

- **Dólar:** como o ouro é cotado em dólar, dólar forte costuma pesar contra o ouro, e dólar fraco costuma ajudar. Não é regra fixa.
- **Juros nos Estados Unidos:** juros mais altos tendem a tirar força do ouro, que não paga juros. Decisões e falas do banco central americano (Fed) mexem forte no preço.
- **Medo e crise:** em guerra, crise ou incerteza, muita gente corre para o ouro como proteção.
- **Notícias da economia americana:** emprego, inflação e juros podem fazer o preço andar muito em poucos minutos.

Nada disso é previsão. É contexto para você entender por que o ouro às vezes anda devagar e, de repente, dispara para um lado.

## O que *mais importa*: o tamanho do lote

No ouro, o erro mais caro do iniciante não é a entrada errada. **É o lote grande demais.**

Em muitas corretoras, 1 lote de ouro equivale a 100 onças. Nesse caso, cada **US$ 1 de movimento no preço** vale:

| Lote | Cada US$ 1 de movimento | Movimento de US$ 5 contra você |
|---|---|---|
| 0,01 | US$ 1 | US$ 5 |
| 0,02 | US$ 2 | US$ 10 |
| 0,10 | US$ 10 | US$ 50 |
| 0,20 | US$ 20 | US$ 100 |

Repare: de 0,01 para 0,10 o risco fica **10 vezes maior**, com a mesma entrada, no mesmo gráfico. E num dia agitado o ouro anda bem mais que US$ 5.

**Antes de operar, confira o tamanho do contrato da sua corretora:** no MetaTrader 5, clique com o botão direito no XAUUSD, em "Observação do mercado", e abra **Especificação**. Lá estão o tamanho do contrato, o lote mínimo e o horário de negociação.

E a alavancagem? Ela deixa você abrir uma posição maior do que o dinheiro na conta. **Ela não diminui o risco: só facilita entrar grande demais.** Eu explico em detalhe em [alavancagem no forex](/blog/alavancagem-no-forex-o-que-e-como-funciona-e-como-usar-com-seguranca).

## Como calcular o lote *a partir do stop*

O caminho certo é de trás para frente: primeiro o quanto você aceita perder, depois o lote.

**Exemplo (conta demo, banca de US$ 1.000, contrato de 100 onças):**

1. **Risco por operação:** 1% da banca = US$ 10.
2. **Stop:** o ponto do gráfico em que a sua ideia está errada. Neste exemplo, US$ 5 de distância da entrada.
3. **Lote:** US$ 10 ÷ US$ 5 = US$ 2 por dólar de movimento → **0,02 lote**.

Se o stop precisar ficar mais longe, o lote diminui. Se a conta não fecha nem com o lote mínimo, a operação não serve para a sua banca naquele momento.

Com 0,10 lote e o mesmo stop, você arriscaria US$ 50, ou 5% da banca, numa única operação. Sequências de perdas acontecem com qualquer trader. Com 1%, uma sequência ruim é um dia ruim. Com 5%, vira o começo do ciclo de quebra.

## *Dobrar a entrada* no ouro: o atalho para zerar

Dobrar o lote depois de cada perda (martingale) ou abrir novas ordens quando o preço vai contra (preço médio) parece um jeito de recuperar rápido. No ouro, que pode andar dezenas de dólares para o mesmo lado, é o jeito mais rápido de zerar a conta.

Pense em dois traders com a mesma banca e as mesmas operações. O que arrisca pouco e fixo perde pouco nas perdas e ainda está de pé quando o mercado vira. O que dobra para recuperar pode não estar mais lá. **Não é o mercado que quebra a banca. É o tamanho da entrada.**

O mesmo raciocínio, com números, está no artigo sobre [o melhor gerenciamento](/blog/qual-e-o-melhor-gerenciamento-para-opcoes-binarias). Ele foi escrito para opções binárias, mas a lógica do risco fixo e do stop do dia vale igual para o ouro.

## *Horários* do ouro

O ouro é negociado quase 24 horas nos dias úteis, com uma pausa curta por dia. O horário exato depende da corretora: confira na **Especificação** do ativo no MetaTrader 5.

- **Mais movimento:** quando Londres e Nova York estão abertas juntas, mais ou menos **entre 9h e 13h de Brasília** (muda um pouco com o horário de verão na Europa e nos Estados Unidos).
- **Notícias dos Estados Unidos:** os dados de emprego e inflação costumam sair às 9h30 ou 10h30 de Brasília. Decisões de juros saem no meio da tarde. No minuto da notícia o preço pode pular e o spread abrir.
- **Mais calmo:** a madrugada de Brasília, depois do fechamento de Nova York.

Mais movimento não é mais chance de ganhar: é mais chance de o preço andar muito, para qualquer lado. Para quem está começando, **evite operar no minuto da notícia**. Veja também os [melhores horários para operar forex](/blog/melhores-horarios-para-operar-forex-no-brasil).

## Custos que *pouca gente olha*

- **Spread:** a diferença entre o preço de compra e o de venda. No ouro ele costuma aumentar em notícia e na virada do dia.
- **Swap:** posição que fica aberta de um dia para o outro paga (ou recebe) uma taxa. Confira o valor na Especificação.
- **Deslizamento:** em movimento forte, a ordem pode ser executada num preço pior que o pedido, inclusive o stop.

## Antes de começar: a parte *legal*

Segundo a CVM, a oferta de forex e CFD a quem mora no Brasil é irregular hoje, e nenhuma corretora tem autorização para oferecer esse produto aqui. Quem opera numa corretora estrangeira fica sem as proteções do mercado brasileiro e precisa declarar o resultado no imposto de renda. Leia [Forex é legal no Brasil?](/blog/forex-e-legal-no-brasil-entenda-a-regulamentacao-e-os-riscos) antes de abrir conta real.

## Como começar no ouro *do jeito certo*

:::na-pratica
1. **Comece pela conta demo.** Treine com saldo virtual até cumprir as suas regras por algumas semanas seguidas.
2. **Abra o MetaTrader 5 e encontre o XAUUSD.** Confira na Especificação o tamanho do contrato, o lote mínimo e o horário.
3. **Defina o risco por operação:** algo perto de 1% da banca, fixo.
4. **Marque o stop antes de entrar** e calcule o lote a partir dele. Nunca o contrário.
5. **Defina o limite do dia:** depois de 2 ou 3 perdas, encerra.
6. **Evite o minuto da notícia** e não dobre a entrada para recuperar.
7. **Registre tudo:** horário, lote, stop, resultado e se seguiu o plano. A [planilha de gerenciamento grátis](https://cristianopereira.com.br/planilha-de-gerenciamento-daytrade) ajuda nesse controle.
:::

Quer o passo a passo em vídeo? No [Forex Bots](https://forexbots.com.br) você entra no grupo grátis do Telegram com o guia do ouro no MetaTrader 5, a gestão de risco em vídeos curtos e robôs para estudar na conta demo.

## *Resumo*

- XAU/USD é o ouro cotado em dólar; no MetaTrader 5 costuma aparecer como XAUUSD.
- O ouro se mexe rápido: quem decide o seu risco é o lote, não a alavancagem.
- Calcule o lote a partir do stop, arriscando algo perto de 1% da banca por operação.
- Mais movimento entre 9h e 13h de Brasília e nas notícias dos Estados Unidos, com mais risco também.
- Comece pela demo e fuja de dobrar a entrada para recuperar.

No ouro, quem dura é quem entra pequeno. Proteja seu capital.

:::aviso
Forex e CFDs, inclusive sobre o ouro, são instrumentos complexos e envolvem alto risco de perda rápida de dinheiro devido à alavancagem, que pode chegar ao valor total depositado. Os exemplos deste artigo são ilustrativos, em conta demo. Este conteúdo é educativo e não é recomendação de investimento. Comece sempre pela conta demo.
:::
