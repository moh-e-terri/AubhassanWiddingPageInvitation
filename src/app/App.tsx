import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { NaqootPage } from '@/features/naqoot/pages/NaqootPage';
import { AdminPage } from '@/features/admin/pages/AdminPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/naqoot" element={<NaqootPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
