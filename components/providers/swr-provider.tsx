'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/utils/swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
