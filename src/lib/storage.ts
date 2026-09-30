import type { AppData, Ayarlar, GunId, Oturum, OturumHareketi, SetKaydi, Taslak } from '../types';

export const STORAGE_KEY = 'spor-takip:data';

export const VARSAYILAN_AYARLAR: Ayarlar = { theme: 'dark', dinlenmeSn: 90 };

export function bosVeri(): AppData {
  return { version: 1, oturumlar: [], ozelVideolar: {}, taslak: null, ayarlar: { ...VARSAYILAN_AYARLAR } };
}

/** Okunamayan ham veriyi ayrı bir anahtara kopyalar; üzerine yazılsa bile elle kurtarılabilir. */
function kurtarmaKopyasi(raw: string): void {
  try {
    localStorage.setItem(`spor-takip:kurtarma-${new Date().toISOString()}`, raw);
  } catch {
    // Depo doluysa yapacak bir şey yok
  }
}

export function yukle(): AppData {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return bosVeri();
    const { veri, atlanan } = veriyiDogrulaEsnek(JSON.parse(raw));
    if (atlanan > 0) {
      console.warn(`${atlanan} bozuk kayıt atlandı; ham veri kurtarma kopyası olarak saklandı`);
      kurtarmaKopyasi(raw);
    }
    return veri;
  } catch (e) {
    console.error('Kayıtlı veri okunamadı; ham veri kurtarma kopyası olarak saklandı', e);
    if (raw) kurtarmaKopyasi(raw);
    return bosVeri();
  }
}

export function kaydet(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Veri kaydedilemedi', e);
  }
}

// ---- Doğrulama (içe aktarma ve açılışta kullanılır) ----

const GUNLER: GunId[] = ['A', 'B', 'C'];

function sayiVeyaNull(x: unknown): number | null {
  return typeof x === 'number' && Number.isFinite(x) ? x : null;
}

function setDogrula(x: unknown): SetKaydi {
  const s = (x ?? {}) as Record<string, unknown>;
  return { kg: sayiVeyaNull(s.kg), tekrar: sayiVeyaNull(s.tekrar), tamamlandi: s.tamamlandi === true };
}

function hareketlerDogrula(x: unknown): OturumHareketi[] {
  if (!Array.isArray(x)) throw new Error('Hareket listesi hatalı.');
  return x.map((h) => {
    const o = (h ?? {}) as Record<string, unknown>;
    if (typeof o.hareketId !== 'string') throw new Error('Hareket kimliği eksik.');
    return { hareketId: o.hareketId, setler: Array.isArray(o.setler) ? o.setler.map(setDogrula) : [] };
  });
}

function gunDogrula(x: unknown): GunId {
  if (!GUNLER.includes(x as GunId)) throw new Error(`Geçersiz gün: ${String(x)}`);
  return x as GunId;
}

function tarihDogrula(x: unknown): string {
  if (typeof x !== 'string' || Number.isNaN(Date.parse(x))) throw new Error('Geçersiz tarih.');
  return x;
}

function oturumDogrula(x: unknown): Oturum {
  const o = (x ?? {}) as Record<string, unknown>;
  if (typeof o.id !== 'string') throw new Error('Oturum kimliği eksik.');
  return {
    id: o.id,
    gunId: gunDogrula(o.gunId),
    baslangic: tarihDogrula(o.baslangic),
    bitis: tarihDogrula(o.bitis),
    sureSn: sayiVeyaNull(o.sureSn) ?? 0,
    hareketler: hareketlerDogrula(o.hareketler),
  };
}

function taslakDogrula(x: unknown): Taslak | null {
  if (!x) return null;
  const o = x as Record<string, unknown>;
  return { gunId: gunDogrula(o.gunId), baslangic: tarihDogrula(o.baslangic), hareketler: hareketlerDogrula(o.hareketler) };
}

/**
 * Açılışta kullanılır: bozuk tek bir oturum yüzünden tüm geçmiş kaybolmasın diye
 * hatalı oturumları atlar, geri kalanını korur.
 */
function veriyiDogrulaEsnek(x: unknown): { veri: AppData; atlanan: number } {
  const o = (x ?? {}) as Record<string, unknown>;
  const hamOturumlar = Array.isArray(o.oturumlar) ? o.oturumlar : [];
  const oturumlar: Oturum[] = [];
  for (const h of hamOturumlar) {
    try {
      oturumlar.push(oturumDogrula(h));
    } catch {
      // atla
    }
  }
  let taslak: Taslak | null = null;
  let taslakBozuk = false;
  try {
    taslak = taslakDogrula(o.taslak);
  } catch {
    taslakBozuk = true;
  }
  const veri = veriyiDogrula({ ...o, version: 1, oturumlar: [], taslak: null });
  return {
    veri: { ...veri, oturumlar, taslak },
    atlanan: hamOturumlar.length - oturumlar.length + (taslakBozuk ? 1 : 0),
  };
}

/** Bilinmeyen bir JSON'u AppData'ya çevirir; bozuksa Türkçe mesajlı Error fırlatır. */
export function veriyiDogrula(x: unknown): AppData {
  if (!x || typeof x !== 'object') throw new Error('Dosya geçerli bir yedek değil.');
  const o = x as Record<string, unknown>;
  if (o.version === undefined) throw new Error('Dosya geçerli bir Spor Takip yedeği değil.');
  if (o.version !== 1) throw new Error('Yedek sürümü desteklenmiyor.');
  if (!Array.isArray(o.oturumlar)) throw new Error('Yedekte oturum listesi yok.');

  const ozelVideolar: Record<string, string> = {};
  if (o.ozelVideolar && typeof o.ozelVideolar === 'object') {
    for (const [k, v] of Object.entries(o.ozelVideolar)) if (typeof v === 'string') ozelVideolar[k] = v;
  }
  const a = (o.ayarlar ?? {}) as Partial<Ayarlar>;

  return {
    version: 1,
    oturumlar: o.oturumlar.map(oturumDogrula),
    ozelVideolar,
    taslak: taslakDogrula(o.taslak),
    ayarlar: {
      theme: a.theme === 'light' ? 'light' : 'dark',
      dinlenmeSn: typeof a.dinlenmeSn === 'number' && a.dinlenmeSn > 0 ? a.dinlenmeSn : VARSAYILAN_AYARLAR.dinlenmeSn,
    },
  };
}

/** randomUUID yalnızca güvenli bağlamda (https/localhost) var; yerel ağdan test için yedekli. */
export function yeniId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
