import { useEffect, useState } from 'react';

export interface Rota {
  /** "/antrenman/A" gibi, baştaki # olmadan */
  yol: string;
  parcalar: string[];
  sorgu: URLSearchParams;
}

function oku(): Rota {
  const ham = window.location.hash.replace(/^#/, '') || '/';
  const [yol, sorgu = ''] = ham.split('?');
  return { yol, parcalar: yol.split('/').filter(Boolean), sorgu: new URLSearchParams(sorgu) };
}

/**
 * Basit hash tabanlı yönlendirme. Statik hostingde yönlendirme kuralı gerektirmez,
 * PWA çevrimdışıyken de sorunsuz çalışır.
 */
export function useHashRoute(): Rota {
  const [rota, setRota] = useState(oku);
  useEffect(() => {
    const dinle = () => {
      setRota(oku());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', dinle);
    return () => window.removeEventListener('hashchange', dinle);
  }, []);
  return rota;
}

export function git(yol: string, { degistir = false } = {}): void {
  if (degistir) window.location.replace(`#${yol}`);
  else window.location.hash = yol;
}
