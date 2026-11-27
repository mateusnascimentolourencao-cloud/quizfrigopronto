export const STEPS = [
  {
    id: 'nome', type: 'text',
    art: '/img/arte-1.webp', artNote: 'Frigorifero aperto, pieno di pasti pronti e organizzati',
    question: () => 'Prima di preparare il tuo piano, come ti chiami?',
  },
  {
    id: 'idade', question: (name) => `${name}, quanti anni hai?`,
    options: [
      ['18–24 anni', 'È il momento ideale per creare una routine che ti semplifichi la vita.'],
      ['25–34 anni', 'In questa fase gli impegni aumentano e avere i pasti pronti per la settimana fa la differenza.'],
      ['35–44 anni', 'Tra lavoro, casa e famiglia, organizzare i pasti ti toglie un bel peso.'],
      ['45–54 anni', 'Mangiare bene senza complicazioni è ciò che aiuta di più in questa fase.'],
      ['55 anni o più', 'Pasti fatti in casa, leggeri e pronti in frigorifero sono perfetti per questa fase.'],
    ],
  },
  {
    id: 'peso', question: () => 'Come ti senti riguardo al tuo peso oggi?',
    options: [
      ['Sono soddisfatta', 'Ottimo. Il tuo piano si concentrerà sul mantenere la routine e risparmiare.'],
      ['Voglio perdere qualche chilo', 'Capisco. Il tuo piano darà priorità a pasti leggeri e facili da seguire.'],
      ['In passato mi sentivo meglio con me stessa e voglio ritrovare quella sensazione', 'Molte persone si trovano nella stessa situazione. Avere i pasti pronti è il primo passo per ricominciare.'],
      ['Non sono per niente soddisfatta', 'Non preoccuparti, non sei sola. Cominciamo dal cibo, che è la parte più difficile.'],
    ],
  },
  {
    id: 'gasto', question: () => 'Pensi di spendere più del dovuto per il cibo?',
    options: [
      ['Sì, molto di più', 'Cambierà quando farai la spesa e cucinerai tutto in una volta.'],
      ['Un po’ di più', 'Puoi risparmiare organizzando tutta la settimana in una volta.'],
      ['Non saprei', 'Quasi tutti si sorprendono quando fanno i conti.'],
      ['No, spendo il giusto', 'Ottimo, allora il piano ti aiuterà a continuare così con meno lavoro.'],
    ],
  },
  {
    id: 'delivery', question: () => 'Quante volte alla settimana ordini da mangiare su iFood o su un’altra app?',
    options: [
      ['Quasi mai', 'Ottimo. Con il piano, i pasti fatti in casa diventano ancora più pratici.'],
      ['1 o 2 volte', 'Con il frigorifero pronto, ordinerai molto meno spesso.'],
      ['3 o 4 volte', 'È qui che noterai il risparmio maggiore a fine mese.'],
      ['Quasi ogni giorno', 'Questo pesa sul budget. Il tuo piano prevede pasti pronti per quei giorni.'],
    ],
  },
  {
    id: 'atrapalha', question: () => 'Che cosa ti impedisce di mangiare bene più di tutto?',
    options: [
      ['Mi manca il tempo', 'Per questo il piano concentra tutto nella domenica. Durante la settimana devi solo prendere e scaldare.'],
      ['Non so cosa cucinare', 'Le ricette e le istruzioni passo passo sono già pronte. Devi solo scegliere.'],
      ['Il cibo sano è noioso', 'Ti piacerà. I pasti sono fatti con cibo davvero gustoso.'],
      ['Mangiare bene costa troppo', 'Il piano usa ingredienti di tutti i giorni, acquistati in una volta sola.'],
    ],
  },
  {
    id: 'domingo', question: () => 'Quanto tempo potresti dedicare la domenica a preparare i pasti per la settimana?',
    options: [
      ['Meno di 1 ora', 'Va bene. Puoi iniziare con pochi pasti pronti e aumentare gradualmente.'],
      ['Da 2 a 3 ore', 'Perfetto. È il tempo ideale per preparare i pasti di tutta la settimana.'],
      ['Più di 3 ore', 'Ottimo, puoi preparare i pasti anche per più di una settimana.'],
      ['Non lo so ancora', 'Nessun problema. Puoi organizzarti con i tuoi tempi, come preferisci.'],
    ],
  },
];

export const VIDEO_SCRIPT_URL = 'https://scripts.converteai.net/fc14b8b2-f479-4866-940f-001c16b5f106/players/6b08e54fdbd1503394023689/v4/player.js';
export const BUY_URL = 'https://pay.cakto.com.br/33ofwux_1351114';
