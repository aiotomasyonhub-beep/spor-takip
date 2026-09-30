import { useMemo, useState } from 'react';
import { ExerciseCard } from '../components/ExerciseCard';
import { Layout } from '../components/Layout';
import { RestTimerBar } from '../components/RestTimerBar';
import { VideoModal } from '../components/VideoModal';
import { gunuBul, hareketiBul } from '../data/program';
import { git } from '../hooks/useHashRoute';
import { useNow } from '../hooks/useNow';
import { useRestTimer } from '../hooks/useRestTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { kisaTitresim, sesiHazirla } from '../lib/feedback';
import { sayac } from '../lib/format';
import { oncekiSetler, setYapildi, type OncekiKayit } from '../lib/stats';
import { aramaUrl } from '../lib/youtube';
import { useAppData } from '../store/AppDataContext';
import type { GunId, Hareket, SetKaydi } from '../types';

export function WorkoutPage({ gunId }: { gunId: string }) {
  const { data, taslakBaslat, setGuncelle, setEkle, setSil, taslakBitir, taslakIptal } = useAppData();
  const gun = gunuBul(gunId);
  const taslak = data.taslak;
  const aktif = !!gun && taslak?.gunId === gun.id;
  const baskaGunAktif = !!taslak && !aktif;

  const dinlenme = useRestTimer();
  const simdi = useNow(1000, aktif);
  useWakeLock(aktif);
  const [videoHareket, setVideoHareket] = useState<Hareket | null>(null);

  const oncekiler = useMemo(() => {
    const m = new Map<string, OncekiKayit | null>();
    for (const h of gun?.hareketler ?? []) m.set(h.id, oncekiSetler(data.oturumlar, h.id));
    return m;
  }, [gun, data.oturumlar]);

  if (!gun) {
    return (
      <Layout baslik="Antrenman bulunamadı" geri="/">
        <p className="text-muted">Bu antrenman programda yok.</p>
      </Layout>
    );
  }

  const tanim = (id: string) => gun.hareketler.find((h) => h.id === id) ?? hareketiBul(id);

  const videoAc = (h: Hareket) => {
    // Kayıtlı video yoksa arama yeni sekmede açılır, modal da link yapıştırmak için açık kalır
    if (!data.ozelVideolar[h.id]) window.open(aramaUrl(h.youtubeArama), '_blank', 'noopener,noreferrer');
    setVideoHareket(h);
  };

  const baslat = (gid: GunId) => {
    sesiHazirla();
    taslakBaslat(gid);
    window.scrollTo(0, 0);
  };

  const setTamamla = (hi: number, si: number, tamamlandi: boolean, hareket: Hareket) => {
    if (!tamamlandi) {
      setGuncelle(hi, si, { tamamlandi: false });
      return;
    }
    sesiHazirla();
    kisaTitresim();
    // Kutular boşsa önceki oturumun değerleriyle doldur: "geçen seferki gibi" tek dokunuşla
    const mevcut = taslak?.hareketler[hi]?.setler[si];
    const onc = oncekiler.get(hareket.id)?.setler[si];
    const degisiklik: Partial<SetKaydi> = { tamamlandi: true };
    if (mevcut?.kg == null && onc?.kg != null && !hareket.agirliksiz) degisiklik.kg = onc.kg;
    if (mevcut?.tekrar == null && onc?.tekrar != null) degisiklik.tekrar = onc.tekrar;
    setGuncelle(hi, si, degisiklik);
    dinlenme.baslat(data.ayarlar.dinlenmeSn);
  };

  const tumSetler = aktif ? taslak.hareketler.flatMap((h) => h.setler) : [];
  const yapilanSet = tumSetler.filter((s) => s.tamamlandi).length;

  const bitir = () => {
    const veriVar = tumSetler.some(setYapildi);
    const soru = veriVar ? 'Antrenman bitirilsin ve kaydedilsin mi?' : 'Hiç set girilmedi. Yine de kaydedilsin mi?';
    if (!window.confirm(soru)) return;
    dinlenme.atla();
    const id = taslakBitir();
    if (id) git(`/gecmis/${id}?yeni=1`, { degistir: true });
  };

  const iptal = () => {
    if (!window.confirm('Bu antrenman silinsin mi? Girilen tüm veriler kaybolacak.')) return;
    dinlenme.atla();
    taslakIptal();
  };

  const altBaslik = aktif
    ? `⏱ ${sayac((simdi - Date.parse(taslak.baslangic)) / 1000)} · ${yapilanSet}/${tumSetler.length} set`
    : gun.odak;

  return (
    <Layout baslik={gun.ad} altBaslik={altBaslik} geri="/" altNav={false}>
      {baskaGunAktif && (
        <div className="mb-4 rounded-2xl border-2 border-warn bg-warn/10 p-4">
          <p className="mb-3 font-semibold">
            {gunuBul(taslak.gunId)?.ad} yarım kaldı. Yeni antrenman başlatırsan o oturum silinir.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => git(`/antrenman/${taslak.gunId}`)} className="h-12 rounded-xl bg-warn font-bold text-bg">
              Ona dön
            </button>
            <button
              onClick={() => {
                if (window.confirm(`${gunuBul(taslak.gunId)?.ad} silinip ${gun.ad} başlatılsın mı?`)) baslat(gun.id);
              }}
              className="h-12 rounded-xl border border-line font-semibold"
            >
              Sil ve başlat
            </button>
          </div>
        </div>
      )}

      {!aktif && !baskaGunAktif && (
        <div className="mb-4">
          <p className="mb-3 rounded-xl bg-surface-2 px-4 py-3 text-[0.95rem]">
            <b>Önce ısın:</b> 5-10 dk hafif yürüyüş ve kol çevirme, ilk harekette 1-2 hafif set.
          </p>
          <button onClick={() => baslat(gun.id)} className="h-16 w-full rounded-2xl bg-accent text-xl font-extrabold text-accent-fg">
            Antrenmanı Başlat
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {aktif
          ? taslak.hareketler.map((kayit, hi) => {
              const h = tanim(kayit.hareketId);
              if (!h) return null;
              return (
                <ExerciseCard
                  key={kayit.hareketId}
                  hareket={h}
                  sira={hi + 1}
                  kayit={kayit}
                  onceki={oncekiler.get(h.id) ?? oncekiSetler(data.oturumlar, h.id)}
                  ozelVideoVar={!!data.ozelVideolar[h.id]}
                  onVideo={() => videoAc(h)}
                  onSetDegis={(si, d) => setGuncelle(hi, si, d)}
                  onSetTamamla={(si, t) => setTamamla(hi, si, t, h)}
                  onSetEkle={() => setEkle(hi)}
                  onSetSil={() => setSil(hi)}
                />
              );
            })
          : gun.hareketler.map((h, i) => (
              <ExerciseCard
                key={h.id}
                hareket={h}
                sira={i + 1}
                onceki={null}
                ozelVideoVar={!!data.ozelVideolar[h.id]}
                onVideo={() => videoAc(h)}
              />
            ))}
      </div>

      {aktif && (
        <div className="mt-6 space-y-3">
          <button onClick={bitir} className="h-16 w-full rounded-2xl bg-accent text-xl font-extrabold text-accent-fg">
            Antrenmanı Bitir
          </button>
          <button onClick={iptal} className="h-12 w-full rounded-xl font-semibold text-danger">
            Antrenmanı iptal et
          </button>
        </div>
      )}

      <RestTimerBar sayac={dinlenme} />
      <VideoModal hareket={videoHareket} onKapat={() => setVideoHareket(null)} />
    </Layout>
  );
}
