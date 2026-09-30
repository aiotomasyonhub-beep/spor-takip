import { GUN_SIRASI } from '../data/program';
import type { GunId, Hareket, Oturum, SetKaydi } from '../types';

/** Set, veri girilmiş ya da işaretlenmişse "yapılmış" sayılır. */
export function setYapildi(s: SetKaydi): boolean {
  return s.tamamlandi || (s.tekrar ?? 0) > 0;
}

/** En yeniden eskiye */
export function siraliOturumlar(oturumlar: Oturum[]): Oturum[] {
  return [...oturumlar].sort((a, b) => b.bitis.localeCompare(a.bitis));
}

export interface GunIstatistik {
  adet: number;
  son: string | null;
}

export function gunIstatistikleri(oturumlar: Oturum[]): Record<GunId, GunIstatistik> {
  const sonuc = Object.fromEntries(GUN_SIRASI.map((g) => [g, { adet: 0, son: null }])) as Record<GunId, GunIstatistik>;
  for (const o of oturumlar) {
    const s = sonuc[o.gunId];
    if (!s) continue;
    s.adet++;
    if (!s.son || o.bitis > s.son) s.son = o.bitis;
  }
  return sonuc;
}

/** En son tamamlanan günden sonraki gün (A → B → C → A). Hiç yoksa A. */
export function siradakiGun(oturumlar: Oturum[]): GunId {
  const son = siraliOturumlar(oturumlar)[0];
  if (!son) return GUN_SIRASI[0];
  const i = GUN_SIRASI.indexOf(son.gunId);
  return GUN_SIRASI[(i + 1) % GUN_SIRASI.length];
}

/** Pazartesi 00:00 */
export function haftaBasi(d = new Date()): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function buHaftaAdet(oturumlar: Oturum[], simdi = new Date()): number {
  const bas = haftaBasi(simdi).getTime();
  return oturumlar.filter((o) => Date.parse(o.bitis) >= bas).length;
}

export interface OncekiKayit {
  tarih: string;
  setler: SetKaydi[];
}

/** Bu hareketin veri girilmiş en son oturumdaki setleri (gün fark etmeksizin). */
export function oncekiSetler(oturumlar: Oturum[], hareketId: string): OncekiKayit | null {
  for (const o of siraliOturumlar(oturumlar)) {
    const h = o.hareketler.find((x) => x.hareketId === hareketId);
    if (h && h.setler.some((s) => s.kg != null || s.tekrar != null)) return { tarih: o.bitis, setler: h.setler };
  }
  return null;
}

export interface OturumOzeti {
  yapilanSet: number;
  toplamSet: number;
  hacim: number;
}

export function oturumOzeti(hareketler: Oturum['hareketler'], birimBul: (id: string) => Hareket | undefined): OturumOzeti {
  let yapilanSet = 0;
  let toplamSet = 0;
  let hacim = 0;
  for (const h of hareketler) {
    const tanim = birimBul(h.hareketId);
    for (const s of h.setler) {
      toplamSet++;
      if (!setYapildi(s)) continue;
      yapilanSet++;
      if (tanim?.birim !== 'saniye') hacim += (s.kg ?? 0) * (s.tekrar ?? 0);
    }
  }
  return { yapilanSet, toplamSet, hacim };
}

export interface IlerlemeNoktasi {
  tarih: string;
  /** Ağırlıklı hareketlerde en yüksek kg; diğerlerinde en yüksek tekrar/saniye */
  enYuksek: number;
  /** Ağırlıklı hareketlerde kg × tekrar toplamı; diğerlerinde toplam tekrar/saniye */
  toplam: number;
}

/** Ağırlıklı mı, yoksa tekrar/süre üzerinden mi izleniyor? */
export function agirlikliMi(h: Hareket): boolean {
  return !h.agirliksiz && h.birim === 'tekrar';
}

/** Eskiden yeniye, hareketin yapıldığı her oturum için bir nokta. */
export function ilerlemeVerisi(oturumlar: Oturum[], hareket: Hareket): IlerlemeNoktasi[] {
  const agirlikli = agirlikliMi(hareket);
  const noktalar: IlerlemeNoktasi[] = [];
  for (const o of [...oturumlar].sort((a, b) => a.bitis.localeCompare(b.bitis))) {
    const h = o.hareketler.find((x) => x.hareketId === hareket.id);
    const setler = h?.setler.filter((s) => (s.tekrar ?? 0) > 0) ?? [];
    if (!setler.length) continue;
    const enYuksek = Math.max(...setler.map((s) => (agirlikli ? (s.kg ?? 0) : (s.tekrar ?? 0))));
    const toplam = setler.reduce((t, s) => t + (agirlikli ? (s.kg ?? 0) * (s.tekrar ?? 0) : (s.tekrar ?? 0)), 0);
    // Ağırlıklı harekette hiç kilo girilmediyse grafiğe sıfır olarak düşmesin
    if (agirlikli && enYuksek === 0) continue;
    noktalar.push({ tarih: o.bitis, enYuksek, toplam });
  }
  return noktalar;
}
