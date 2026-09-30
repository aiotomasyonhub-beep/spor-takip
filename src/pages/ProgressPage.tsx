import { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { ProgressChart } from '../components/ProgressChart';
import { tumHareketler } from '../data/program';
import { kisaTarih, sayi } from '../lib/format';
import { agirlikliMi, ilerlemeVerisi } from '../lib/stats';
import { useAppData } from '../store/AppDataContext';
import type { Hareket } from '../types';

function etiketler(h: Hareket) {
  if (agirlikliMi(h)) return { enYuksek: 'En yüksek kilo', toplam: 'Toplam hacim (kilo × tekrar)', birim: 'kg', toplamBirim: 'kg' };
  if (h.birim === 'saniye') return { enYuksek: 'En uzun süre', toplam: 'Toplam süre', birim: 'sn', toplamBirim: 'sn' };
  return { enYuksek: 'En çok tekrar', toplam: 'Toplam tekrar', birim: 'tekrar', toplamBirim: 'tekrar' };
}

export function ProgressPage() {
  const { data } = useAppData();
  const hareketler = useMemo(tumHareketler, []);
  const [secili, setSecili] = useState(() => {
    // Varsayılan: verisi olan ilk hareket
    const ilk = hareketler.find((h) => ilerlemeVerisi(data.oturumlar, h).length > 0);
    return (ilk ?? hareketler[0]).id;
  });

  const hareket = hareketler.find((h) => h.id === secili) ?? hareketler[0];
  const veri = useMemo(() => ilerlemeVerisi(data.oturumlar, hareket), [data.oturumlar, hareket]);
  const e = etiketler(hareket);
  const rekor = veri.length ? Math.max(...veri.map((v) => v.enYuksek)) : 0;
  const son = veri.at(-1);

  return (
    <Layout baslik="İlerleme" sekme="ilerleme">
      <label htmlFor="hareket-sec" className="mb-2 block text-sm font-semibold text-muted">
        Hareket
      </label>
      <select
        id="hareket-sec"
        value={hareket.id}
        onChange={(ev) => setSecili(ev.target.value)}
        className="mb-4 h-14 w-full rounded-xl border border-line bg-surface px-3 text-lg font-semibold focus:border-accent focus:outline-none"
      >
        {hareketler.map((h) => (
          <option key={h.id} value={h.id}>
            {h.ad}
          </option>
        ))}
      </select>

      {veri.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          Bu hareket için henüz kayıt yok. Antrenmanda set girdikçe grafik oluşacak.
        </div>
      ) : (
        <div className="space-y-4">
          <section className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Rekor', `${sayi(rekor)} ${e.birim}`],
              ['Son', son ? `${sayi(son.enYuksek)} ${e.birim}` : '—'],
              ['Oturum', String(veri.length)],
            ].map(([etiket, deger]) => (
              <div key={etiket} className="rounded-2xl border border-line bg-surface p-3">
                <div className="text-xs font-semibold tracking-wide text-muted uppercase">{etiket}</div>
                <div className="tabular text-lg font-bold">{deger}</div>
              </div>
            ))}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <ProgressChart baslik={e.enYuksek} birim={e.birim} veri={veri.map((v) => ({ tarih: v.tarih, deger: v.enYuksek }))} />
            <ProgressChart baslik={e.toplam} birim={e.toplamBirim} veri={veri.map((v) => ({ tarih: v.tarih, deger: v.toplam }))} />
          </div>

          <details className="rounded-2xl border border-line bg-surface p-4">
            <summary className="cursor-pointer font-semibold">Tablo olarak göster</summary>
            <table className="tabular mt-3 w-full text-left">
              <thead className="text-sm text-muted">
                <tr>
                  <th className="py-1 font-semibold">Tarih</th>
                  <th className="py-1 text-right font-semibold">{e.enYuksek}</th>
                  <th className="py-1 text-right font-semibold">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {[...veri].reverse().map((v) => (
                  <tr key={v.tarih} className="border-t border-line">
                    <td className="py-2">{kisaTarih(v.tarih)}</td>
                    <td className="py-2 text-right">
                      {sayi(v.enYuksek)} {e.birim}
                    </td>
                    <td className="py-2 text-right">
                      {sayi(v.toplam)} {e.toplamBirim}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </Layout>
  );
}
