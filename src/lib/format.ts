const tarihFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
const kisaTarihFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' });
const saatFmt = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });
const sayiFmt = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });

/** "30 Eylül 2026 Çarşamba" */
export const uzunTarih = (iso: string) => tarihFmt.format(new Date(iso));
/** "30 Eyl" */
export const kisaTarih = (iso: string) => kisaTarihFmt.format(new Date(iso));
/** "18:05" */
export const saat = (iso: string) => saatFmt.format(new Date(iso));
/** 1234.5 → "1.234,5" */
export const sayi = (n: number) => sayiFmt.format(n);

/** 3125 → "52 dk", 3900 → "1 sa 5 dk" */
export function sure(sn: number): string {
  const dk = Math.round(sn / 60);
  if (dk < 60) return `${dk} dk`;
  const sa = Math.floor(dk / 60);
  const kalan = dk % 60;
  return kalan ? `${sa} sa ${kalan} dk` : `${sa} sa`;
}

/** 83 → "1:23", 3723 → "1:02:03" */
export function sayac(sn: number): string {
  const s = Math.max(0, Math.floor(sn));
  const sa = Math.floor(s / 3600);
  const dk = Math.floor((s % 3600) / 60);
  const kalan = String(s % 60).padStart(2, '0');
  return sa ? `${sa}:${String(dk).padStart(2, '0')}:${kalan}` : `${dk}:${kalan}`;
}

function gunBasi(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** "Bugün", "Dün", "3 gün önce", "2 hafta önce" */
export function goreceliGun(iso: string, simdi = new Date()): string {
  const fark = Math.round((gunBasi(simdi) - gunBasi(new Date(iso))) / 86_400_000);
  if (fark <= 0) return 'Bugün';
  if (fark === 1) return 'Dün';
  if (fark < 14) return `${fark} gün önce`;
  if (fark < 60) return `${Math.floor(fark / 7)} hafta önce`;
  return `${Math.floor(fark / 30)} ay önce`;
}

/** Türkçe klavyedeki virgülü de kabul eder: "12,5" → 12.5. Boş/geçersiz → null. */
export function sayiOku(girdi: string): number | null {
  const s = girdi.replace(',', '.').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** [8, 10] → "8-10", [10, 10] → "10" */
export function aralik([min, max]: [number, number]): string {
  return min === max ? String(min) : `${min}-${max}`;
}
