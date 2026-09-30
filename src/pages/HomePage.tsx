import { Layout } from '../components/Layout';
import { WorkoutCard } from '../components/WorkoutCard';
import { PROGRAM, gunuBul } from '../data/program';
import { git } from '../hooks/useHashRoute';
import { saat } from '../lib/format';
import { buHaftaAdet, gunIstatistikleri, siradakiGun } from '../lib/stats';
import { useAppData } from '../store/AppDataContext';

const HAFTALIK_HEDEF = 3;

export function HomePage() {
  const { data } = useAppData();
  const { oturumlar, taslak } = data;
  const istatistik = gunIstatistikleri(oturumlar);
  const siradaki = siradakiGun(oturumlar);
  const hafta = buHaftaAdet(oturumlar);

  return (
    <Layout baslik="Spor Takip" sekme="ana">
      {taslak && (
        <button
          onClick={() => git(`/antrenman/${taslak.gunId}`)}
          className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-warn bg-warn/10 p-4 text-left"
        >
          <div>
            <div className="font-bold text-warn">Yarım kalan antrenman</div>
            <div className="text-sm">
              {gunuBul(taslak.gunId)?.ad} · başlangıç {saat(taslak.baslangic)}
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-warn px-4 py-3 font-bold text-bg">Devam et</span>
        </button>
      )}

      <section className="mb-4 grid grid-cols-2 gap-3" aria-label="Özet">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">Bu hafta</div>
          <div className="tabular text-3xl font-extrabold">
            {hafta}
            <span className="text-xl text-muted">/{HAFTALIK_HEDEF}</span>
          </div>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: HAFTALIK_HEDEF }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < hafta ? 'bg-accent' : 'bg-surface-2'}`} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">Toplam</div>
          <div className="tabular text-3xl font-extrabold">{oturumlar.length}</div>
          <div className="text-sm text-muted">antrenman</div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {PROGRAM.map((gun) => (
          <WorkoutCard
            key={gun.id}
            gun={gun}
            istatistik={istatistik[gun.id]}
            siradaki={gun.id === siradaki}
            devamEdiyor={taslak?.gunId === gun.id}
            onAc={() => git(`/antrenman/${gun.id}`)}
          />
        ))}
      </div>
    </Layout>
  );
}
