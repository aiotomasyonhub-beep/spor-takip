import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppDataProvider } from './store/AppDataContext';
import './index.css';

// Tarayıcıdan verileri depolama baskısında silmemesini iste (destekleyenlerde)
void navigator.storage?.persist?.().catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDataProvider>
      <App />
    </AppDataProvider>
  </StrictMode>,
);
