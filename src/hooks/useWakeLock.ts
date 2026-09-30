import { useEffect } from 'react';

/** Antrenman sırasında ekranın kararmasını engeller (destekleyen tarayıcılarda). */
export function useWakeLock(aktif: boolean): void {
  useEffect(() => {
    if (!aktif || !('wakeLock' in navigator)) return;
    let kilit: WakeLockSentinel | null = null;
    let iptal = false;

    const iste = async () => {
      try {
        const k = await navigator.wakeLock.request('screen');
        if (iptal) void k.release();
        else kilit = k;
      } catch {
        // Pil tasarrufu vb. nedenlerle reddedilebilir; sorun değil
      }
    };
    // Sekme arka plana gidince kilit düşer, geri gelince yeniden iste
    const gorunurluk = () => {
      if (document.visibilityState === 'visible') void iste();
    };

    void iste();
    document.addEventListener('visibilitychange', gorunurluk);
    return () => {
      iptal = true;
      document.removeEventListener('visibilitychange', gorunurluk);
      void kilit?.release();
    };
  }, [aktif]);
}
