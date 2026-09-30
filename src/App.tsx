import { lazy, Suspense } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkoutPage } from './pages/WorkoutPage';

// Grafik kütüphanesi büyük; yalnızca İlerleme açılınca yüklensin (service worker yine önbelleğe alır)
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));

/*
 * Rotalar:
 *   #/                  Ana sayfa
 *   #/antrenman/:gun    Antrenman ekranı (A, B, C)
 *   #/gecmis            Geçmiş
 *   #/gecmis/:id        Oturum detayı
 *   #/ilerleme          İlerleme grafikleri
 *   #/ayarlar           Ayarlar
 */
export default function App() {
  const { parcalar, sorgu } = useHashRoute();
  const [bolum, param] = parcalar;

  switch (bolum) {
    case 'antrenman':
      return <WorkoutPage key={param} gunId={param ?? ''} />;
    case 'gecmis':
      return param ? <SessionDetailPage id={param} yeni={sorgu.has('yeni')} /> : <HistoryPage />;
    case 'ilerleme':
      return (
        <Suspense fallback={null}>
          <ProgressPage />
        </Suspense>
      );
    case 'ayarlar':
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}
