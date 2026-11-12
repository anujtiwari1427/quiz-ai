import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { requestPersistentStorage, ensureDefaultBlueprints } from './db';
import { FILE_SYSTEM_SERVICE } from './services/fileSystemService';
import './index.css';

// Initialize local-first storage and PWA
if (typeof window !== 'undefined') {
  requestPersistentStorage().then((persisted) => {
    if (persisted) {
      console.log('✓ Local IndexedDB storage is persisted by browser.');
    }
  });

  ensureDefaultBlueprints().catch(console.warn);
  FILE_SYSTEM_SERVICE.initStoredDirectory().catch(console.warn);

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('PWA ServiceWorker registration failed:', err);
      });
    });
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
