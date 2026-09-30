import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { kisaTarih, sayi, uzunTarih } from '../lib/format';

export interface GrafikNoktasi {
  tarih: string;
  deger: number;
}

interface Props {
  baslik: string;
  birim: string;
  veri: GrafikNoktasi[];
}

/** Tek serili çizgi grafik (seriyi başlık adlandırır, lejant gerekmez). */
export function ProgressChart({ baslik, birim, veri }: Props) {
  const noktalar = veri.map((v) => ({ ...v, etiket: kisaTarih(v.tarih) }));

  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="mb-3 font-bold">
        {baslik} <span className="font-normal text-muted">({birim})</span>
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={noktalar} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" strokeOpacity={0.6} />
            <XAxis
              dataKey="etiket"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--line)' }}
              minTickGap={16}
            />
            <YAxis
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => sayi(v)}
            />
            <Tooltip
              cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }}
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as (GrafikNoktasi & { etiket: string }) | undefined;
                if (!active || !p) return null;
                return (
                  <div className="rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm shadow-lg">
                    <div className="text-muted">{uzunTarih(p.tarih)}</div>
                    <div className="tabular text-base font-bold text-fg">
                      {sayi(p.deger)} {birim}
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="linear"
              dataKey="deger"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
