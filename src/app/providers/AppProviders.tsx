import type { ReactNode } from 'react';
import { WeddingExperienceProvider } from '@/features/landing/context/WeddingExperienceContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <WeddingExperienceProvider>{children}</WeddingExperienceProvider>;
}
