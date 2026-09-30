import { useState } from 'react';
import { aramaUrl, embedUrl, videoIdCikar } from '../lib/youtube';
import { useAppData } from '../store/AppDataContext';
import type { Hareket } from '../types';
import { IkonDis } from './icons';
import { Modal } from './Modal';

interface Props {
  hareket: Hareket | null;
  onKapat: () => void;
}

export function VideoModal({ hareket, onKapat }: Props) {
  return (
    <Modal acik={hareket !== null} onKapat={onKapat} baslik={hareket?.ad ?? ''}>
      {/* key: hareket değişince form durumu sıfırlansın */}
      {hareket && <VideoIcerik key={hareket.id} hareket={hareket} />}
    </Modal>
  );
}

function VideoIcerik({ hareket }: { hareket: Hareket }) {
  const { data, videoKaydet } = useAppData();
  const videoId = data.ozelVideolar[hareket.id];
  const [link, setLink] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);

  const kaydet = () => {
    const id = videoIdCikar(link);
    if (!id) {
      setHata('Bu linkten video bulunamadı. youtube.com/watch?v=…, youtu.be/… veya shorts linki yapıştır.');
      return;
    }
    videoKaydet(hareket.id, id);
    setLink('');
    setHata(null);
    setMesaj('Video kaydedildi. Bu hareket her günde bu videoyu gösterecek.');
  };

  const sifirla = () => {
    videoKaydet(hareket.id, null);
    setMesaj('Özel video kaldırıldı. Artık YouTube araması açılacak.');
  };

  return (
    <div className="space-y-5">
      {videoId ? (
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl(videoId)}
              title={hareket.ad}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-2 text-sm text-muted">Video için internet bağlantısı gerekir.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-surface-2 p-4">
          <p className="mb-3">
            Bu hareket için kayıtlı video yok. YouTube araması yeni sekmede açıldı. Beğendiğin videonun linkini aşağıya
            yapıştırırsan bir dahakine burada oynar.
          </p>
          <a
            href={aramaUrl(hareket.youtubeArama)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-danger/90 px-4 font-bold text-white"
          >
            YouTube'da ara <IkonDis />
          </a>
          <p className="mt-2 text-center text-sm text-muted">"{hareket.youtubeArama}"</p>
        </div>
      )}

      <div className="border-t border-line pt-4">
        <label htmlFor="video-link" className="mb-2 block font-bold">
          Bu hareketin videosunu değiştir
        </label>
        <div className="flex gap-2">
          <input
            id="video-link"
            type="url"
            inputMode="url"
            placeholder="YouTube linki yapıştır"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setHata(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && kaydet()}
            className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 placeholder:text-muted/70 focus:border-accent focus:outline-none"
          />
          <button
            onClick={kaydet}
            disabled={!link.trim()}
            className="h-12 shrink-0 rounded-xl bg-accent px-4 font-bold text-accent-fg disabled:opacity-40"
          >
            Kaydet
          </button>
        </div>
        {hata && <p className="mt-2 text-sm text-danger">{hata}</p>}
        {mesaj && !hata && <p className="mt-2 text-sm text-accent">{mesaj}</p>}

        {videoId && (
          <button onClick={sifirla} className="mt-4 h-12 w-full rounded-xl border border-line font-semibold text-muted hover:bg-surface-2">
            Sıfırla (YouTube aramasına dön)
          </button>
        )}
      </div>
    </div>
  );
}
