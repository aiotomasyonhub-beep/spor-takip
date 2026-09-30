export interface KuralBolumu {
  baslik: string;
  maddeler: string[];
  vurgu?: 'tehlike' | 'uyari' | 'bilgi';
}

export const KURALLAR: KuralBolumu[] = [
  {
    baslik: 'Yasak hareketler',
    vurgu: 'tehlike',
    maddeler: [
      'Bel fıtığı ve diz sakatlığı var.',
      'Mekik/crunch, ağır squat, deadlift, lunge ve zıplama YAPILMAYACAK.',
    ],
  },
  {
    baslik: 'Hemen bırak',
    vurgu: 'tehlike',
    maddeler: [
      'Bacağa yayılan ağrı, uyuşma veya karıncalanma olursa hareketi hemen bırak.',
      'Dizde keskin ağrı olursa hareketi hemen bırak.',
    ],
  },
  {
    baslik: 'Form',
    vurgu: 'uyari',
    maddeler: ['Barı yerden alırken dizler hafif bükük, sırt düz.'],
  },
  {
    baslik: 'Yüklenme',
    vurgu: 'bilgi',
    maddeler: [
      'Her sette 1-2 tekrar yapacak güç kalsın.',
      'Tekrar aralığının üst sınırına rahatça ulaşınca ağırlığı biraz artır.',
    ],
  },
  {
    baslik: 'Isınma',
    vurgu: 'bilgi',
    maddeler: ['5-10 dk hafif yürüyüş ve kol çevirme.', 'İlk harekette 1-2 hafif set.'],
  },
];
