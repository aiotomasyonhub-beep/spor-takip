import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Sitenin yayınlandığı alt yol.
 * - Netlify / Vercel / yerel: "/"
 * - GitHub Pages: "/<depo-adı>/" (GitHub Actions'taki GITHUB_REPOSITORY'den otomatik bulunur)
 * Elle vermek için: BASE_PATH=/baska-yol/ npm run build
 */
function tabanYol(): string {
  if (process.env.BASE_PATH) return process.env.BASE_PATH;
  const depo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  // kullaniciadi.github.io adlı depo kök adreste yayınlanır
  if (depo && !depo.endsWith('.github.io')) return `/${depo}/`;
  return '/';
}

const base = tabanYol();

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Spor Takip',
        short_name: 'Spor',
        description: 'Kişisel antrenman takip uygulaması',
        lang: 'tr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b0f14',
        theme_color: '#0b0f14',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
