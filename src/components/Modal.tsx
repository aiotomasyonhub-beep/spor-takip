import { useEffect, type ReactNode } from 'react';
import { IkonKapat } from './icons';

interface Props {
  acik: boolean;
  onKapat: () => void;
  baslik: string;
  children: ReactNode;
}

/** Mobilde alttan açılan sayfa, geniş ekranda ortada pencere. */
export function Modal({ acik, onKapat, baslik, children }: Props) {
  useEffect(() => {
    if (!acik) return;
    const tus = (e: KeyboardEvent) => e.key === 'Escape' && onKapat();
    const eskiTasma = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', tus);
    return () => {
      document.body.style.overflow = eskiTasma;
      window.removeEventListener('keydown', tus);
    };
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={baslik}>
      <div className="absolute inset-0 bg-black/70" onClick={onKapat} />
      <div className="pb-safe relative flex max-h-[92dvh] w-full max-w-xl flex-col rounded-t-2xl border border-line bg-surface md:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-lg font-bold">{baslik}</h2>
          <button
            onClick={onKapat}
            className="-mr-2 flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-muted hover:bg-surface-2"
            aria-label="Kapat"
          >
            <IkonKapat />
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
