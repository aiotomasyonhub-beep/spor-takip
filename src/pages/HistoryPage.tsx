import { Layout } from '../components/Layout';
import { gunuBul, hareketiBul } from '../data/program';
import { git } from '../hooks/useHashRoute';
import { saat, sayi, sure, uzunTarih } from '../lib/format';
import { oturumOzeti, siraliOturumlar } from '../lib/stats';
import { useAppData } from '../store/AppDataContext';

export function HistoryPage() {
  const { data } = useAppData();
  const oturumlar = siraliOturumlar(data.oturumlar);

  return (
    <Layout baslik="Geçmiş" altBaslik={`${oturumlar.length} antrenman`} sekme="gecmis">
      {oturumlar.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          Henüz kayıtlı antrenman yok. İlk antrenmanını bitirdiğinde burada görünecek.
        </div>
      ) : (
        <ul className="space-y-3">
          {oturumlar.map((o) => {
            const ozet = oturumOzeti(o.hareketler, hareketiBul);
            return (
              <li key={o.id}>
                <button
                  onClick={() => git(`/gecmis/${o.id}`)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left active:scale-[0.99]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-2xl font-extrabold text-accent">
                    {o.gunId}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{uzunTarih(o.bitis)}</div>
                    <div className="text-sm text-muted">
                      {gunuBul(o.gunId)?.ad} · {saat(o.baslangic)} · {sure(o.sureSn)}
                    </div>
                    <div className="tabular text-sm text-muted">
                      {ozet.yapilanSet} set{ozet.hacim > 0 ? ` · ${sayi(ozet.hacim)} kg hacim` : ''}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Layout>
  );
}
