export const STEPS = [
  {
    id: 'nome', type: 'text',
    art: '/img/arte-1.webp', artNote: 'Geladeira aberta, cheia de marmitas organizadas',
    question: () => 'Antes de montar o seu plano, como você se chama?',
  },
  {
    id: 'idade', question: (name) => `${name}, qual é a sua idade?`,
    options: [
      ['18 a 24', 'Ótimo momento pra criar uma rotina que facilita a sua vida.'],
      ['25 a 34', 'Nessa fase a correria aperta, e ter a semana pronta faz toda a diferença.'],
      ['35 a 44', 'Com trabalho, casa e família, organizar a comida tira um peso enorme.'],
      ['45 a 54', 'Comer bem sem complicar é o que mais ajuda nessa fase.'],
      ['55 ou mais', 'Comida caseira, leve e pronta na geladeira combina muito com essa fase.'],
    ],
  },
  {
    id: 'peso', question: () => 'Como você se sente com o seu peso hoje?',
    options: [
      ['Estou satisfeita', 'Ótimo. Então o seu plano vai focar em manter a rotina e economizar.'],
      ['Quero perder alguns quilos', 'Entendi. O seu plano vai priorizar marmitas leves e fáceis de seguir.'],
      ['Já estive numa versão melhor de mim e quero voltar', 'Muita gente está exatamente aí. Ter a comida pronta é o primeiro passo pra voltar.'],
      ['Não estou nada satisfeita', 'Fica tranquila, você não está sozinha. Vamos começar pela comida, que é a parte mais difícil.'],
    ],
  },
  {
    id: 'gasto', question: () => 'Você sente que gasta mais do que deveria com comida?',
    options: [
      ['Sim, muito mais', 'Isso vai mudar quando você comprar e cozinhar tudo de uma vez.'],
      ['Um pouco mais', 'Dá pra economizar organizando a semana de uma vez só.'],
      ['Não sei dizer', 'Quase todo mundo se surpreende quando faz essa conta.'],
      ['Não, gasto bem', 'Ótimo, então o plano vai te ajudar a manter isso com menos trabalho.'],
    ],
  },
  {
    id: 'delivery', question: () => 'Quantas vezes por semana você pede comida no iFood ou em outro aplicativo?',
    options: [
      ['Quase nunca', 'Ótimo. Com o plano, a comida de casa fica ainda mais prática.'],
      ['1 ou 2 vezes', 'Com a geladeira pronta, esses pedidos ficam mais raros.'],
      ['3 ou 4 vezes', 'É aqui que a economia mais aparece no fim do mês.'],
      ['Quase todo dia', 'Isso pesa no bolso. O seu plano vai ter comida pronta pra esses dias.'],
    ],
  },
  {
    id: 'atrapalha', question: () => 'O que mais te atrapalha pra comer bem?',
    options: [
      ['Falta de tempo', 'Por isso o plano concentra tudo no domingo. Na semana, você só pega e esquenta.'],
      ['Não sei o que cozinhar', 'As receitas e o passo a passo já vêm prontos. Você só escolhe.'],
      ['Comida saudável é sem graça', 'Você vai gostar. As marmitas são de comida gostosa de verdade.'],
      ['Comer bem sai caro', 'O plano usa ingredientes do dia a dia, comprados de uma vez.'],
    ],
  },
  {
    id: 'domingo', question: () => 'Quanto tempo você conseguiria separar no domingo pra deixar a semana pronta?',
    options: [
      ['Menos de 1 hora', 'Tudo bem. Dá pra começar com poucas marmitas e ir aumentando.'],
      ['2 a 3 horas', 'Perfeito. É o tempo ideal pra deixar a semana inteira pronta.'],
      ['Mais de 3 horas', 'Ótimo, dá pra deixar até mais de uma semana adiantada.'],
      ['Ainda não sei', 'Sem problema. Você monta no seu ritmo, do jeito que couber na sua rotina.'],
    ],
  },
];

export const VIDEO_URL = 'https://player-vz-de976c3f-628.tv.pandavideo.com.br/embed/?v=d22e8f74-5111-4cb3-92c7-cd110a759446&autoplay=true&muted=true';
export const BUY_URL = 'https://pay.cakto.com.br/33ofwux_1351114';
