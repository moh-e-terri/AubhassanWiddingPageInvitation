import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { applySiteMeta } from '@/lib/seo/applySiteMeta';
import '@/styles/global.css';
import '@/styles/landing.css';

applySiteMeta();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
