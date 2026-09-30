import { useEffect, useState } from 'react';

/** Her `aralikMs`'de güncellenen şimdiki zaman (ms). `aktif` false iken durur. */
export function useNow(aralikMs = 1000, aktif = true): number {
  const [simdi, setSimdi] = useState(() => Date.now());
  useEffect(() => {
    if (!aktif) return;
    setSimdi(Date.now());
    const id = window.setInterval(() => setSimdi(Date.now()), aralikMs);
    return () => window.clearInterval(id);
  }, [aralikMs, aktif]);
  return simdi;
}
