import { Layout } from '../components/Layout';
import { IkonCop } from '../components/icons';
import { gunuBul, hareketiBul } from '../data/program';
import { git } from '../hooks/useHashRoute';
import { saat, sayi, sure, uzunTarih } from '../lib/format';
import { oturumOzeti, setYapildi } from '../lib/stats';
import { useAppData } from '../store/AppDataContext';

export function SessionDetailPage({ id, yeni }: { id: string; yeni: boolean }) {
  const { data, oturumSil } = useAppData();
  const oturum = data.oturumlar.find((o) => o.id === id);

  if (!oturum) {
    return (
      <Layout baslik="Oturum bulunamadı" geri="/gecmis">
        <p className="text-muted">Bu oturum silinmiş olabilir.</p>
      </Layout>
    );
  }

  const gun = gunuBul(oturum.gunId);
  const ozet = oturumOzeti(oturum.hareketler, hareketiBul);

  const sil = () => {
    if (!window.confirm('Bu oturum kalıcı olarak silinsin mi?')) return;
    oturumSil(oturum.id);
    git('/gecmis', { degistir: true });
  };

  return (
    <Layout baslik={gun?.ad ?? `Antrenman ${oturum.gunId}`} altBaslik={uzunTarih(oturum.bitis)} geri={yeni ? '/' : '/gecmis'}>
      {yeni && (
        <div className="mb-4 rounded-2xl border-2 border-accent bg-accent/10 p-4 text-center">
          <div className="text-2xl font-extrabold text-accent">Antrenman kaydedildi 💪</div>
          <button onClick={() => git('/')} className="mt-3 h-12 w-full rounded-xl bg-accent font-bold text-accent-fg">
            Ana sayfaya dön
          </button>
        </div>
      )}

      <section className="mb-4 grid grid-cols-3 gap-2 text-center">
        {[
          ['Süre', sure(oturum.sureSn)],
          ['Set', `${ozet.yapilanSet}`],
          ['Hacim', ozet.hacim > 0 ? `${sayi(ozet.hacim)} kg` : '—'],
        ].map(([etiket, deger]) => (
          <div key={etiket} className="rounded-2xl border border-line bg-surface p-3">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">{etiket}</div>
            <div className="tabular text-lg font-bold">{deger}</div>
          </div>
        ))}
      </section>
      <p className="mb-4 text-sm text-muted">
        {saat(oturum.baslangic)} – {saat(oturum.bitis)}
      </p>

      <div className="space-y-3">
        {oturum.hareketler.map((h) => {
          const tanim = hareketiBul(h.hareketId);
          const saniye = tanim?.birim === 'saniye';
          const setler = h.setler.map((s, i) => ({ s, no: i + 1 })).filter(({ s }) => setYapildi(s) || s.kg != null);
          if (!setler.length) {
            return (
              <p key={h.hareketId} className="flex justify-between rounded-2xl border border-line px-4 py-3 text-muted">
                <span>{tanim?.ad ?? h.hareketId}</span>
                <span>Yapılmadı</span>
              </p>
            );
          }
          return (
            <section key={h.hareketId} className="rounded-2xl border border-line bg-surface p-4">
              <h3 className="mb-2 font-bold">{tanim?.ad ?? h.hareketId}</h3>
              <ol className="space-y-1">
                {setler.map(({ s, no }) => (
                  <li key={no} className="tabular flex items-center gap-3">
                    <span className="w-6 text-muted">{no}.</span>
                    <span className="flex-1">
                      {s.kg != null && !tanim?.agirliksiz ? `${sayi(s.kg)} kg × ` : ''}
                      {s.tekrar != null ? `${s.tekrar} ${saniye ? 'sn' : 'tekrar'}` : '—'}
                    </span>
                    {s.tamamlandi && <span className="text-accent">✓</span>}
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <button
        onClick={sil}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger/60 font-semibold text-danger hover:bg-danger/10"
      >
        <IkonCop /> Oturumu sil
      </button>
    </Layout>
  );
}
