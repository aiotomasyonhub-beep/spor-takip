import { aralik, goreceliGun, kisaTarih } from '../lib/format';
import type { GunIstatistik } from '../lib/stats';
import type { AntrenmanGunu } from '../types';

interface Props {
  gun: AntrenmanGunu;
  istatistik: GunIstatistik;
  siradaki: boolean;
  devamEdiyor: boolean;
  onAc: () => void;
}

export function WorkoutCard({ gun, istatistik, siradaki, devamEdiyor, onAc }: Props) {
  return (
    <button
      onClick={onAc}
      className={`relative flex w-full min-w-0 flex-col rounded-2xl border bg-surface p-4 text-left transition active:scale-[0.99] ${
        siradaki ? 'border-accent ring-2 ring-accent' : 'border-line'
      }`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h2 className="text-2xl font-extrabold">{gun.ad}</h2>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {siradaki && <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-fg">Sıradaki</span>}
          {devamEdiyor && (
            <span className="rounded-full border border-warn px-3 py-1 text-sm font-bold text-warn">Devam ediyor</span>
          )}
        </div>
      </div>
      {gun.odak && <p className="mb-3 text-sm text-muted">{gun.odak}</p>}

      <ul className="mb-4 space-y-1.5 text-[0.95rem]">
        {gun.hareketler.map((h) => (
          <li key={h.id} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">{h.ad}</span>
            <span className="tabular shrink-0 text-muted">
              {h.setSayisi}×{aralik(h.tekrarAraligi)}
              {h.birim === 'saniye' ? ' sn' : ''}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-line pt-3">
        <div>
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">Tamamlanan</div>
          <div className="tabular text-xl font-bold">{istatistik.adet} kez</div>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">En son</div>
          <div className="text-xl font-bold">{istatistik.son ? goreceliGun(istatistik.son) : '—'}</div>
          {istatistik.son && <div className="text-sm text-muted">{kisaTarih(istatistik.son)}</div>}
        </div>
      </div>
    </button>
  );
}
