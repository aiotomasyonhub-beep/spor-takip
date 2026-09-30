import { sayac } from '../lib/format';
import type { DinlenmeSayaci } from '../hooks/useRestTimer';

/** Ekranın altında sabit dinlenme sayacı. */
export function RestTimerBar({ sayac: s }: { sayac: DinlenmeSayaci }) {
  if (!s.aktif && !s.bitti) return null;

  if (s.bitti) {
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-accent text-accent-fg" role="status" aria-live="assertive">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-center text-2xl font-extrabold">Dinlenme bitti · Sıradaki set!</div>
      </div>
    );
  }

  const oran = s.toplamSn ? s.kalanSn / s.toplamSn : 0;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface shadow-[0_-8px_24px_rgba(0,0,0,0.35)]" role="timer">
      <div className="h-1.5 bg-surface-2">
        <div className="h-full bg-accent transition-[width] duration-300 ease-linear" style={{ width: `${oran * 100}%` }} />
      </div>
      <div className="mx-auto flex h-20 max-w-5xl items-center gap-2 px-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">Dinlenme</div>
          <div className="tabular text-4xl leading-none font-extrabold">{sayac(s.kalanSn)}</div>
        </div>
        <button onClick={() => s.ekle(-15)} className="tabular h-14 w-16 rounded-xl bg-surface-2 text-lg font-bold" aria-label="15 saniye azalt">
          −15
        </button>
        <button onClick={() => s.ekle(15)} className="tabular h-14 w-16 rounded-xl bg-surface-2 text-lg font-bold" aria-label="15 saniye ekle">
          +15
        </button>
        <button onClick={s.atla} className="h-14 rounded-xl bg-accent px-4 text-lg font-bold text-accent-fg">
          Atla
        </button>
      </div>
    </div>
  );
}
