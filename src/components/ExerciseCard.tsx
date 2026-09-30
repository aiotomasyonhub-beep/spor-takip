import { aralik, kisaTarih } from '../lib/format';
import type { OncekiKayit } from '../lib/stats';
import type { Hareket, OturumHareketi, SetKaydi } from '../types';
import { IkonOynat, IkonUyari } from './icons';
import { SetRow } from './SetRow';

interface Props {
  hareket: Hareket;
  sira: number;
  /** Oturum aktifken bu hareketin set kayıtları */
  kayit?: OturumHareketi;
  onceki: OncekiKayit | null;
  ozelVideoVar: boolean;
  onVideo: () => void;
  onSetDegis?: (setIndex: number, degisiklik: Partial<SetKaydi>) => void;
  onSetTamamla?: (setIndex: number, tamamlandi: boolean) => void;
  onSetEkle?: () => void;
  onSetSil?: () => void;
}

export function ExerciseCard({ hareket, sira, kayit, onceki, ozelVideoVar, onVideo, onSetDegis, onSetTamamla, onSetEkle, onSetSil }: Props) {
  const birimKisa = hareket.birim === 'saniye' ? 'Sn' : 'Tekrar';
  const agirliksiz = !!hareket.agirliksiz;
  const yapilan = kayit?.setler.filter((s) => s.tamamlandi).length ?? 0;
  const hepsiBitti = !!kayit && kayit.setler.length > 0 && yapilan === kayit.setler.length;

  return (
    <article className={`min-w-0 rounded-2xl border bg-surface p-4 ${hepsiBitti ? 'border-accent/70' : 'border-line'}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
            hepsiBitti ? 'bg-accent text-accent-fg' : 'bg-surface-2 text-muted'
          }`}
        >
          {sira}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl leading-tight font-bold">{hareket.ad}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="tabular rounded-lg bg-surface-2 px-2.5 py-1 font-semibold">
              {hareket.setSayisi} × {aralik(hareket.tekrarAraligi)} {hareket.birim === 'saniye' ? 'sn' : 'tekrar'}
            </span>
            {hareket.herKol && (
              <span className="rounded-lg border border-info/60 px-2.5 py-1 text-sm font-bold text-info">
                {hareket.tarafEtiketi ?? 'Her kol'}
              </span>
            )}
            {kayit && (
              <span className={`tabular ml-auto text-sm font-semibold ${hepsiBitti ? 'text-accent' : 'text-muted'}`}>
                {yapilan}/{kayit.setler.length} set
              </span>
            )}
          </div>
        </div>
      </div>

      {hareket.not && (
        <p className="mt-3 flex gap-2 rounded-xl bg-warn/10 px-3 py-2 text-[0.95rem] leading-snug">
          <IkonUyari className="mt-0.5 shrink-0 text-warn" />
          <span>{hareket.not}</span>
        </p>
      )}

      <button
        onClick={onVideo}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line font-semibold hover:bg-surface-2"
      >
        <IkonOynat className="text-danger" />
        Videoyu İzle
        {!ozelVideoVar && <span className="text-sm font-normal text-muted">(YouTube araması)</span>}
      </button>

      {kayit && onSetDegis && onSetTamamla && (
        <div className="mt-4">
          <div
            className={`mb-1 grid gap-2 px-1 text-center text-xs font-semibold tracking-wide text-muted uppercase ${
              agirliksiz ? 'grid-cols-[2.25rem_1fr_3.5rem]' : 'grid-cols-[2.25rem_1fr_1fr_3.5rem]'
            }`}
          >
            <span>Set</span>
            {!agirliksiz && <span>Kg</span>}
            <span>
              {birimKisa}
              {hareket.herKol ? ` (${(hareket.tarafEtiketi ?? 'Her kol').toLowerCase()})` : ''}
            </span>
            <span>✓</span>
          </div>
          <div className="space-y-1.5">
            {kayit.setler.map((s, i) => (
              <SetRow
                key={i}
                no={i + 1}
                set={s}
                onceki={onceki?.setler[i]}
                agirliksiz={agirliksiz}
                birimKisa={birimKisa}
                onDegis={(d) => onSetDegis(i, d)}
                onTamamla={(t) => onSetTamamla(i, t)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm text-muted">{onceki ? `Gri değerler: ${kisaTarih(onceki.tarih)} oturumu` : 'İlk kez yapılıyor'}</span>
            <div className="flex gap-2">
              {kayit.setler.length > 1 && (
                <button onClick={onSetSil} className="h-10 rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-muted hover:bg-surface-2">
                  − Set
                </button>
              )}
              <button onClick={onSetEkle} className="h-10 rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-muted hover:bg-surface-2">
                + Set
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
