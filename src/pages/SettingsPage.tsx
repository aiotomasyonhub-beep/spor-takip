import { useRef, useState, type ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { bosVeri, veriyiDogrula } from '../lib/storage';
import { useAppData } from '../store/AppDataContext';

function Bolum({ baslik, children }: { baslik: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-3 text-lg font-bold">{baslik}</h2>
      {children}
    </section>
  );
}

function Secenekler<T extends string | number>({
  deger,
  secenekler,
  onSec,
}: {
  deger: T;
  secenekler: { deger: T; ad: string }[];
  onSec: (d: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${secenekler.length}, minmax(0, 1fr))` }}>
      {secenekler.map((s) => (
        <button
          key={String(s.deger)}
          onClick={() => onSec(s.deger)}
          aria-pressed={deger === s.deger}
          className={`h-12 rounded-xl border font-semibold ${
            deger === s.deger ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface-2'
          }`}
        >
          {s.ad}
        </button>
      ))}
    </div>
  );
}

const dosyaAdi = () => `spor-takip-yedek-${new Date().toISOString().slice(0, 10)}.json`;

export function SettingsPage() {
  const { data, ayarGuncelle, veriyiDegistir } = useAppData();
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [mesaj, setMesaj] = useState<{ tur: 'ok' | 'hata'; metin: string } | null>(null);

  const yedekDosyasi = () =>
    new File([JSON.stringify(data, null, 2)], dosyaAdi(), { type: 'application/json' });

  const disaAktar = () => {
    const url = URL.createObjectURL(yedekDosyasi());
    const a = document.createElement('a');
    a.href = url;
    a.download = dosyaAdi();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMesaj({ tur: 'ok', metin: 'Yedek dosyası indirildi.' });
  };

  const dosyaPaylasilabilir = typeof navigator.canShare === 'function' && navigator.canShare({ files: [yedekDosyasi()] });

  const paylas = async () => {
    try {
      await navigator.share({ files: [yedekDosyasi()], title: 'Spor Takip yedeği' });
    } catch {
      // Kullanıcı paylaşımı iptal etti
    }
  };

  const iceAktar = async (dosya: File) => {
    try {
      const yeni = veriyiDogrula(JSON.parse(await dosya.text()));
      const onay = window.confirm(
        `Yedekte ${yeni.oturumlar.length} antrenman var.\n\nŞu anki veriler (${data.oturumlar.length} antrenman) silinip yedektekiler yüklensin mi?`,
      );
      if (!onay) return;
      veriyiDegistir(yeni);
      setMesaj({ tur: 'ok', metin: `${yeni.oturumlar.length} antrenman yüklendi.` });
    } catch (e) {
      setMesaj({ tur: 'hata', metin: `İçe aktarılamadı: ${e instanceof Error ? e.message : 'dosya okunamadı.'}` });
    }
  };

  const hepsiniSil = () => {
    if (!window.confirm('TÜM antrenman geçmişi, videolar ve ayarlar silinecek. Emin misin?')) return;
    if (!window.confirm('Bu işlem geri alınamaz. Önce yedek almanı öneririm. Yine de silinsin mi?')) return;
    veriyiDegistir(bosVeri());
    setMesaj({ tur: 'ok', metin: 'Tüm veriler silindi.' });
  };

  return (
    <Layout baslik="Ayarlar" sekme="ayarlar">
      <div className="space-y-4">
        <Bolum baslik="Yedekleme">
          <p className="mb-3 text-[0.95rem] text-muted">
            Veriler yalnızca bu cihazdaki tarayıcıda durur. Tarayıcı verisini silersen ya da telefonu değiştirirsen kaybolur. Düzenli
            yedek al.
          </p>
          <div className="grid gap-2">
            <button onClick={disaAktar} className="h-14 rounded-xl bg-accent text-lg font-bold text-accent-fg">
              JSON olarak dışa aktar
            </button>
            {dosyaPaylasilabilir && (
              <button onClick={paylas} className="h-12 rounded-xl border border-line bg-surface-2 font-semibold">
                Yedeği paylaş (Drive, Dosyalar, WhatsApp…)
              </button>
            )}
            <button onClick={() => dosyaRef.current?.click()} className="h-14 rounded-xl border border-line bg-surface-2 text-lg font-bold">
              JSON içe aktar
            </button>
            <input
              ref={dosyaRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) void iceAktar(f);
              }}
            />
          </div>
          {mesaj && (
            <p className={`mt-3 font-semibold ${mesaj.tur === 'ok' ? 'text-accent' : 'text-danger'}`} role="status">
              {mesaj.metin}
            </p>
          )}
          <p className="mt-3 text-sm text-muted">
            Kayıtlı: {data.oturumlar.length} antrenman · {Object.keys(data.ozelVideolar).length} özel video
          </p>
        </Bolum>

        <Bolum baslik="Tema">
          <Secenekler
            deger={data.ayarlar.theme}
            secenekler={[
              { deger: 'dark', ad: 'Koyu' },
              { deger: 'light', ad: 'Açık' },
            ]}
            onSec={(theme) => ayarGuncelle({ theme })}
          />
        </Bolum>

        <Bolum baslik="Dinlenme süresi">
          <Secenekler
            deger={data.ayarlar.dinlenmeSn}
            secenekler={[60, 90, 120, 180].map((sn) => ({ deger: sn, ad: `${sn} sn` }))}
            onSec={(dinlenmeSn) => ayarGuncelle({ dinlenmeSn })}
          />
        </Bolum>

        <Bolum baslik="Tehlikeli bölge">
          <button onClick={hepsiniSil} className="h-12 w-full rounded-xl border border-danger/60 font-semibold text-danger hover:bg-danger/10">
            Tüm verileri sil
          </button>
        </Bolum>
      </div>
    </Layout>
  );
}
