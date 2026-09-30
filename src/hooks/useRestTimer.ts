import { useCallback, useEffect, useState } from 'react';
import { bitisSinyali } from '../lib/feedback';
import { useNow } from './useNow';

const KEY = 'spor-takip:dinlenme';

interface Durum {
  /** Bitiş zamanı (ms). Zaman damgası tutulduğu için sayfa yenilense de doğru kalır. */
  bitis: number;
  toplamSn: number;
}

function oku(): Durum | null {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Durum | null;
    return d && d.bitis > Date.now() ? d : null;
  } catch {
    return null;
  }
}

function yaz(d: Durum | null) {
  try {
    if (d) localStorage.setItem(KEY, JSON.stringify(d));
    else localStorage.removeItem(KEY);
  } catch {
    // yoksay
  }
}

export interface DinlenmeSayaci {
  aktif: boolean;
  /** Sayaç bittiyse birkaç saniye "Hazır" gösterimi için */
  bitti: boolean;
  kalanSn: number;
  toplamSn: number;
  baslat: (sn: number) => void;
  ekle: (sn: number) => void;
  atla: () => void;
}

export function useRestTimer(): DinlenmeSayaci {
  const [durum, setDurum] = useState<Durum | null>(oku);
  const [bitti, setBitti] = useState(false);
  const simdi = useNow(250, durum !== null);

  const guncelle = useCallback((d: Durum | null) => {
    yaz(d);
    setDurum(d);
  }, []);

  const kalanMs = durum ? durum.bitis - simdi : 0;

  useEffect(() => {
    if (durum && kalanMs <= 0) {
      bitisSinyali();
      guncelle(null);
      setBitti(true);
    }
  }, [durum, kalanMs, guncelle]);

  useEffect(() => {
    if (!bitti) return;
    const id = window.setTimeout(() => setBitti(false), 4000);
    return () => window.clearTimeout(id);
  }, [bitti]);

  const baslat = useCallback(
    (sn: number) => {
      setBitti(false);
      guncelle({ bitis: Date.now() + sn * 1000, toplamSn: sn });
    },
    [guncelle],
  );

  const ekle = useCallback(
    (sn: number) => {
      if (!durum) return;
      const bitis = Math.max(Date.now() + 1000, durum.bitis + sn * 1000);
      guncelle({ bitis, toplamSn: Math.max(durum.toplamSn + sn, 1) });
    },
    [durum, guncelle],
  );

  const atla = useCallback(() => {
    setBitti(false);
    guncelle(null);
  }, [guncelle]);

  return {
    aktif: durum !== null,
    bitti,
    // useNow durakken bayat kalan "şimdi" değeri kısa süre büyük görünmesin diye sınırlandırılır
    kalanSn: Math.min(durum?.toplamSn ?? 0, Math.max(0, Math.ceil(kalanMs / 1000))),
    toplamSn: durum?.toplamSn ?? 0,
    baslat,
    ekle,
    atla,
  };
}
