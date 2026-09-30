import type { AntrenmanGunu, Hareket } from '../types';

/*
 * ANTRENMAN PROGRAMI
 * ------------------
 * Programı buradan düzenleyebilirsin.
 *
 * Alanlar:
 *   id            Kalıcı kimlik. Aynı hareket birden fazla günde geçiyorsa AYNI id'yi kullan:
 *                 ilerleme grafiği, "önceki oturum" değerleri ve özel video bu id'de birleşir.
 *                 Kayıtlı geçmişi olan bir hareketin id'sini değiştirirsen eski kayıtlar ondan kopar.
 *   ad            Görünen ad
 *   setSayisi     Hedef set sayısı
 *   tekrarAraligi [min, max]. Tek değer için [10, 10] yaz.
 *   birim         'tekrar' veya 'saniye' (plank gibi süreli hareketler)
 *   herKol        Tek kol / tek taraf hareketi mi?
 *   tarafEtiketi  (opsiyonel) 'Her kol' | 'Her taraf'. Varsayılan 'Her kol'.
 *   agirliksiz    (opsiyonel) true ise kilo kutusu gösterilmez.
 *   not           Form / güvenlik notu
 *   youtubeArama  Kayıtlı video yoksa açılacak YouTube araması
 */

// Birden fazla günde geçen hareketler bir kez tanımlanır, günlerde `...` ile üzerine yazılır.
const tekKolRow: Omit<Hareket, 'setSayisi' | 'tekrarAraligi'> = {
  id: 'tek-kol-dumbbell-row',
  ad: 'Tek Kol Dumbbell Row',
  birim: 'tekrar',
  herKol: true,
  tarafEtiketi: 'Her kol',
  youtubeArama: 'one arm dumbbell row supported form',
};

const barbellShrug: Omit<Hareket, 'setSayisi' | 'tekrarAraligi'> = {
  id: 'barbell-shrug',
  ad: 'Barbell Shrug',
  birim: 'tekrar',
  herKol: false,
  youtubeArama: 'barbell shrug proper form',
};

const gluteBridge: Omit<Hareket, 'setSayisi' | 'tekrarAraligi'> = {
  id: 'glute-bridge',
  ad: 'Glute Bridge',
  birim: 'tekrar',
  herKol: false,
  youtubeArama: 'glute bridge proper form',
};

export const PROGRAM: AntrenmanGunu[] = [
  {
    id: 'A',
    ad: 'Antrenman A',
    odak: 'Göğüs · Sırt · Trapez · Kol',
    hareketler: [
      {
        id: 'barbell-floor-press',
        ad: 'Barbell Floor Press',
        setSayisi: 4,
        tekrarAraligi: [8, 10],
        birim: 'tekrar',
        herKol: false,
        not: 'Göğüs ve arka kol. Yerde yapıldığı için bel güvende.',
        youtubeArama: 'barbell floor press form',
      },
      {
        ...tekKolRow,
        setSayisi: 3,
        tekrarAraligi: [10, 12],
        not: 'Boştaki elle masa/sandalyeye dayan, sırt düz.',
      },
      {
        ...barbellShrug,
        setSayisi: 4,
        tekrarAraligi: [12, 15],
        not: 'Orta ağırlık, karın sıkı, yukarıda 1 sn tut.',
      },
      {
        id: 'barbell-curl-duvar',
        ad: 'Barbell Curl (sırt duvara yaslı)',
        setSayisi: 3,
        tekrarAraligi: [10, 10],
        birim: 'tekrar',
        herKol: false,
        not: 'Sallanma yok.',
        youtubeArama: 'wall barbell curl',
      },
      {
        id: 'yerde-barbell-triceps-extension',
        ad: 'Yerde Barbell Triceps Extension',
        setSayisi: 3,
        tekrarAraligi: [10, 12],
        birim: 'tekrar',
        herKol: false,
        youtubeArama: 'floor skull crusher barbell',
      },
      { ...gluteBridge, setSayisi: 3, tekrarAraligi: [12, 15] },
      {
        id: 'bird-dog',
        ad: 'Bird Dog',
        setSayisi: 3,
        tekrarAraligi: [8, 8],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her taraf',
        agirliksiz: true,
        not: 'Bel stabilitesi.',
        youtubeArama: 'bird dog exercise mcgill',
      },
    ],
  },
  {
    id: 'B',
    ad: 'Antrenman B',
    odak: 'Omuz · Sırt · Trapez · Kol · Core',
    hareketler: [
      {
        id: 'landmine-press',
        ad: 'Landmine Press',
        setSayisi: 3,
        tekrarAraligi: [10, 10],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her kol',
        not: 'Barın bir ucu duvar köşesinde.',
        youtubeArama: 'single arm landmine press',
      },
      {
        id: 'yerde-barbell-pullover',
        ad: 'Yerde Barbell Pullover',
        setSayisi: 3,
        tekrarAraligi: [12, 12],
        birim: 'tekrar',
        herKol: false,
        youtubeArama: 'floor barbell pullover',
      },
      {
        id: 'tek-kol-dumbbell-shrug',
        ad: 'Tek Kol Dumbbell Shrug',
        setSayisi: 3,
        tekrarAraligi: [12, 15],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her taraf',
        youtubeArama: 'single arm dumbbell shrug',
      },
      {
        id: 'hammer-curl',
        ad: 'Hammer Curl',
        setSayisi: 3,
        tekrarAraligi: [10, 12],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her kol',
        youtubeArama: 'dumbbell hammer curl form',
      },
      {
        id: 'dar-tutus-floor-press',
        ad: 'Dar Tutuş Floor Press',
        setSayisi: 3,
        tekrarAraligi: [10, 10],
        birim: 'tekrar',
        herKol: false,
        youtubeArama: 'close grip barbell floor press',
      },
      {
        id: 'yuzustu-y-kaldirma',
        ad: 'Yüzüstü Y Kaldırma',
        setSayisi: 3,
        tekrarAraligi: [12, 12],
        birim: 'tekrar',
        herKol: false,
        not: 'Ağırlıksız veya çok hafif.',
        youtubeArama: 'prone Y raise exercise',
      },
      {
        id: 'yan-plank',
        ad: 'Yan Plank',
        setSayisi: 3,
        tekrarAraligi: [20, 30],
        birim: 'saniye',
        herKol: true,
        tarafEtiketi: 'Her taraf',
        agirliksiz: true,
        youtubeArama: 'side plank proper form',
      },
    ],
  },
  {
    id: 'C',
    ad: 'Antrenman C',
    odak: 'Sırt · Trapez · Kol · Omuz · Core',
    hareketler: [
      {
        ...tekKolRow,
        setSayisi: 4,
        tekrarAraligi: [8, 10],
        not: 'A gününden biraz daha ağır.',
      },
      {
        ...barbellShrug,
        setSayisi: 4,
        tekrarAraligi: [10, 12],
        not: 'A gününden biraz daha ağır.',
      },
      {
        id: 'ters-tutus-barbell-curl',
        ad: 'Ters Tutuş Barbell Curl',
        setSayisi: 3,
        tekrarAraligi: [10, 10],
        birim: 'tekrar',
        herKol: false,
        youtubeArama: 'reverse grip barbell curl',
      },
      {
        id: 'konsantrasyon-curl',
        ad: 'Konsantrasyon Curl',
        setSayisi: 3,
        tekrarAraligi: [10, 12],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her kol',
        not: 'Oturarak.',
        youtubeArama: 'dumbbell concentration curl',
      },
      {
        id: 'yerde-tek-kol-dumbbell-triceps-extension',
        ad: 'Yerde Tek Kol Dumbbell Triceps Extension',
        setSayisi: 3,
        tekrarAraligi: [10, 12],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her kol',
        youtubeArama: 'lying single arm dumbbell triceps extension',
      },
      {
        id: 'tek-kol-lateral-raise',
        ad: 'Tek Kol Yana Açış (Lateral Raise)',
        setSayisi: 3,
        tekrarAraligi: [12, 15],
        birim: 'tekrar',
        herKol: true,
        tarafEtiketi: 'Her kol',
        not: 'Boştaki elle bir yere tutun.',
        youtubeArama: 'single arm lateral raise',
      },
      {
        id: 'mcgill-curl-up',
        ad: 'McGill Curl-up',
        setSayisi: 3,
        tekrarAraligi: [8, 8],
        birim: 'tekrar',
        herKol: false,
        agirliksiz: true,
        not: 'Mekik yerine. Bir diz bükük, eller bel altında.',
        youtubeArama: 'mcgill curl up',
      },
      { ...gluteBridge, setSayisi: 3, tekrarAraligi: [15, 15] },
    ],
  },
];

/** A → B → C → A döngü sırası */
export const GUN_SIRASI = PROGRAM.map((g) => g.id);

export function gunuBul(id: string): AntrenmanGunu | undefined {
  return PROGRAM.find((g) => g.id === id);
}

/** Tüm günlerdeki benzersiz hareketler (ilk tanım esas alınır). */
export function tumHareketler(): Hareket[] {
  const map = new Map<string, Hareket>();
  for (const gun of PROGRAM) for (const h of gun.hareketler) if (!map.has(h.id)) map.set(h.id, h);
  return [...map.values()];
}

export function hareketiBul(id: string): Hareket | undefined {
  return tumHareketler().find((h) => h.id === id);
}
