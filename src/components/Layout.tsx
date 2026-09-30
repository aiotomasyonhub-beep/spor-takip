import { useState, type ReactNode } from 'react';
import { git } from '../hooks/useHashRoute';
import { IkonAyar, IkonEv, IkonGecmis, IkonGeri, IkonGrafik, IkonKalkan } from './icons';
import { RulesModal } from './RulesModal';

interface Props {
  baslik: string;
  altBaslik?: string;
  /** Verilirse solda geri butonu çıkar ve bu yola gider */
  geri?: string;
  /** Alt gezinme çubuğu (antrenman ekranında gizlenir) */
  altNav?: boolean;
  /** Aktif alt sekme */
  sekme?: 'ana' | 'gecmis' | 'ilerleme' | 'ayarlar';
  children: ReactNode;
}

const SEKMELER = [
  { id: 'ana', yol: '/', ad: 'Ana Sayfa', Ikon: IkonEv },
  { id: 'gecmis', yol: '/gecmis', ad: 'Geçmiş', Ikon: IkonGecmis },
  { id: 'ilerleme', yol: '/ilerleme', ad: 'İlerleme', Ikon: IkonGrafik },
  { id: 'ayarlar', yol: '/ayarlar', ad: 'Ayarlar', Ikon: IkonAyar },
] as const;

export function Layout({ baslik, altBaslik, geri, altNav = true, sekme, children }: Props) {
  const [kurallarAcik, setKurallarAcik] = useState(false);

  return (
    <div className="min-h-dvh">
      <header className="pt-safe sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-3">
          {geri && (
            <button
              onClick={() => git(geri)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-3xl hover:bg-surface-2"
              aria-label="Geri"
            >
              <IkonGeri />
            </button>
          )}
          <div className={`min-w-0 flex-1 ${geri ? '' : 'pl-1'}`}>
            <h1 className="truncate text-xl leading-tight font-bold">{baslik}</h1>
            {altBaslik && <p className="truncate text-sm text-muted">{altBaslik}</p>}
          </div>
          <button
            onClick={() => setKurallarAcik(true)}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-warn/50 px-3 font-semibold text-warn hover:bg-warn/10"
            aria-label="Güvenlik kurallarını göster"
          >
            <IkonKalkan className="text-2xl" />
            <span className="text-sm">Kurallar</span>
          </button>
        </div>
      </header>

      <main className={`mx-auto max-w-5xl px-4 pt-4 ${altNav ? 'pb-28' : 'pb-40'}`}>{children}</main>

      {altNav && (
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur">
          <div className="mx-auto grid max-w-5xl grid-cols-4">
            {SEKMELER.map(({ id, yol, ad, Ikon }) => {
              const aktif = sekme === id;
              return (
                <button
                  key={id}
                  onClick={() => git(yol)}
                  className={`flex h-16 flex-col items-center justify-center gap-0.5 ${aktif ? 'text-accent' : 'text-muted'}`}
                  aria-current={aktif ? 'page' : undefined}
                >
                  <Ikon className="text-2xl" />
                  <span className="text-xs font-semibold">{ad}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <RulesModal acik={kurallarAcik} onKapat={() => setKurallarAcik(false)} />
    </div>
  );
}
