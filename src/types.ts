export type Birim = 'tekrar' | 'saniye';

/** Programdaki tek bir hareket. Aynı hareket farklı günlerde aynı `id` ile geçebilir. */
export interface Hareket {
  /** Hareketin kalıcı kimliği. İlerleme, "önceki oturum" ve özel video bu id'ye bağlıdır. */
  id: string;
  ad: string;
  setSayisi: number;
  /** [min, max]. Tek değerli hedefler için ikisi aynı olur, örn. [10, 10]. */
  tekrarAraligi: [number, number];
  birim: Birim;
  /** Tek kol / tek taraf yapılan hareket mi? */
  herKol: boolean;
  /** herKol true iken gösterilecek etiket. Varsayılan: "Her kol". */
  tarafEtiketi?: 'Her kol' | 'Her taraf';
  /** Kilo girişi gereksizse true (vücut ağırlığı hareketleri). */
  agirliksiz?: boolean;
  not?: string;
  /** YouTube arama sorgusu (İngilizce). */
  youtubeArama: string;
}

export type GunId = 'A' | 'B' | 'C';

export interface AntrenmanGunu {
  id: GunId;
  ad: string;
  /** Kartta gösterilen kısa odak açıklaması. */
  odak?: string;
  hareketler: Hareket[];
}

/** Bir setin kaydı. `tekrar`, saniye birimli hareketlerde saniyeyi tutar. */
export interface SetKaydi {
  kg: number | null;
  tekrar: number | null;
  tamamlandi: boolean;
}

export interface OturumHareketi {
  hareketId: string;
  setler: SetKaydi[];
}

export interface Oturum {
  id: string;
  gunId: GunId;
  /** ISO tarih */
  baslangic: string;
  /** ISO tarih */
  bitis: string;
  sureSn: number;
  hareketler: OturumHareketi[];
}

/** Yarım kalan (devam eden) oturum. */
export interface Taslak {
  gunId: GunId;
  baslangic: string;
  hareketler: OturumHareketi[];
}

export interface Ayarlar {
  theme: 'dark' | 'light';
  dinlenmeSn: number;
}

export interface AppData {
  version: 1;
  oturumlar: Oturum[];
  /** hareketId → YouTube video ID */
  ozelVideolar: Record<string, string>;
  taslak: Taslak | null;
  ayarlar: Ayarlar;
}
