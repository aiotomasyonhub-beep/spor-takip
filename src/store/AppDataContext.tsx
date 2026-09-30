import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { gunuBul } from '../data/program';
import { kaydet, yeniId, yukle } from '../lib/storage';
import type { AppData, Ayarlar, GunId, Oturum, SetKaydi } from '../types';

interface AppDataApi {
  data: AppData;
  taslakBaslat: (gunId: GunId) => void;
  setGuncelle: (hareketIndex: number, setIndex: number, degisiklik: Partial<SetKaydi>) => void;
  setEkle: (hareketIndex: number) => void;
  setSil: (hareketIndex: number) => void;
  /** Taslağı oturum olarak kaydeder, yeni oturumun id'sini döner. */
  taslakBitir: () => string | null;
  taslakIptal: () => void;
  oturumSil: (id: string) => void;
  videoKaydet: (hareketId: string, videoId: string | null) => void;
  ayarGuncelle: (degisiklik: Partial<Ayarlar>) => void;
  veriyiDegistir: (yeni: AppData) => void;
}

const Ctx = createContext<AppDataApi | null>(null);

const bosSet = (): SetKaydi => ({ kg: null, tekrar: null, tamamlandi: false });

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(yukle);
  const dataRef = useRef(data);

  // Her değişiklik anında localStorage'a yazılır (yarım oturum dahil)
  useEffect(() => {
    dataRef.current = data;
    kaydet(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.theme = data.ayarlar.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', data.ayarlar.theme === 'light' ? '#f4f6f8' : '#0b0f14');
  }, [data.ayarlar.theme]);

  const taslakBaslat = useCallback((gunId: GunId) => {
    const gun = gunuBul(gunId);
    if (!gun) return;
    setData((d) => ({
      ...d,
      taslak: {
        gunId,
        baslangic: new Date().toISOString(),
        hareketler: gun.hareketler.map((h) => ({ hareketId: h.id, setler: Array.from({ length: h.setSayisi }, bosSet) })),
      },
    }));
  }, []);

  const hareketleriDegistir = useCallback(
    (hareketIndex: number, fn: (setler: SetKaydi[]) => SetKaydi[]) =>
      setData((d) => {
        if (!d.taslak) return d;
        const hareketler = d.taslak.hareketler.map((h, i) => (i === hareketIndex ? { ...h, setler: fn(h.setler) } : h));
        return { ...d, taslak: { ...d.taslak, hareketler } };
      }),
    [],
  );

  const setGuncelle = useCallback(
    (hi: number, si: number, degisiklik: Partial<SetKaydi>) =>
      hareketleriDegistir(hi, (setler) => setler.map((s, i) => (i === si ? { ...s, ...degisiklik } : s))),
    [hareketleriDegistir],
  );

  const setEkle = useCallback((hi: number) => hareketleriDegistir(hi, (setler) => [...setler, bosSet()]), [hareketleriDegistir]);

  const setSil = useCallback(
    (hi: number) => hareketleriDegistir(hi, (setler) => (setler.length > 1 ? setler.slice(0, -1) : setler)),
    [hareketleriDegistir],
  );

  const taslakBitir = useCallback(() => {
    const taslak = dataRef.current.taslak;
    if (!taslak) return null;
    const bitis = new Date();
    const oturum: Oturum = {
      id: yeniId(),
      gunId: taslak.gunId,
      baslangic: taslak.baslangic,
      bitis: bitis.toISOString(),
      sureSn: Math.round((bitis.getTime() - Date.parse(taslak.baslangic)) / 1000),
      hareketler: taslak.hareketler,
    };
    setData((d) => ({ ...d, oturumlar: [...d.oturumlar, oturum], taslak: null }));
    return oturum.id;
  }, []);

  const taslakIptal = useCallback(() => setData((d) => ({ ...d, taslak: null })), []);

  const oturumSil = useCallback((id: string) => setData((d) => ({ ...d, oturumlar: d.oturumlar.filter((o) => o.id !== id) })), []);

  const videoKaydet = useCallback(
    (hareketId: string, videoId: string | null) =>
      setData((d) => {
        const ozelVideolar = { ...d.ozelVideolar };
        if (videoId) ozelVideolar[hareketId] = videoId;
        else delete ozelVideolar[hareketId];
        return { ...d, ozelVideolar };
      }),
    [],
  );

  const ayarGuncelle = useCallback(
    (degisiklik: Partial<Ayarlar>) => setData((d) => ({ ...d, ayarlar: { ...d.ayarlar, ...degisiklik } })),
    [],
  );

  const veriyiDegistir = useCallback((yeni: AppData) => setData(yeni), []);

  const api = useMemo<AppDataApi>(
    () => ({ data, taslakBaslat, setGuncelle, setEkle, setSil, taslakBitir, taslakIptal, oturumSil, videoKaydet, ayarGuncelle, veriyiDegistir }),
    [data, taslakBaslat, setGuncelle, setEkle, setSil, taslakBitir, taslakIptal, oturumSil, videoKaydet, ayarGuncelle, veriyiDegistir],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAppData(): AppDataApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppData, AppDataProvider içinde kullanılmalı');
  return v;
}
